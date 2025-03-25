const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Database connection
const paystack = require('../services/paystack');

// Generate unique order ID
const generateOrderId = () => {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

// Initialize payment
router.post('/api/payments/initialize', async (req, res) => {
    const { email, amount, metadata = {} } = req.body;

    // Validation
    if (!email || !amount) {
        return res.status(400).json({
            status: false,
            message: 'Email and amount are required'
        });
    }

    try {
        // Initialize transaction with Paystack
        const response = await paystack.initialiseTransaction(email, amount, metadata);
        
        // Create pending payment record in database
        const [dbResult] = await pool.execute(
            `INSERT INTO payments (
                reference, 
                amount, 
                status,
                customer_email,
                order_id
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                response.data.reference,
                amount,
                'pending',
                email,
                metadata.orderId || generateOrderId()
            ]
        );

        res.status(200).json({
            status: true,
            message: 'Payment initialized',
            data: {
                authorization_url: response.data.authorization_url,
                reference: response.data.reference,
                dbId: dbResult.insertId
            }
        });

    } catch (error) {
        console.error("Payment initialization error:", error);
        res.status(500).json({
            status: false,
            message: 'Payment initialization failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
});

// Verify payment
router.get('/api/payments/verify/:reference', async (req, res) => {
    const { reference } = req.params;
    
    if (!reference || reference.length < 10) {
        return res.status(400).json({
            status: false,
            message: 'Valid payment reference is required'
        });
    }

    try {
        // 1. Verify with Paystack
        const verification = await paystack.verifyTransaction(reference);
        
        // 2. Check verification status
        if (verification.data.status !== 'success') {
            // Update payment status in database
            await pool.execute(
                `UPDATE payments SET status = ? WHERE reference = ?`,
                ['failed', reference]
            );
            
            return res.status(400).json({
                status: false,
                message: verification.data.gateway_response || 'Payment not successful'
            });
        }

        // 3. Prepare complete payment data
        const paymentData = {
            amount: verification.data.amount / 100,
            currency: verification.data.currency,
            status: verification.data.status,
            customer_email: verification.data.customer?.email,
            paid_at: new Date(verification.data.paid_at),
            gateway_response: verification.data.gateway_response,
            channel: verification.data.channel,
            ip_address: verification.data.ip_address
        };

        // 4. Update database with complete payment details
        const [updateResult] = await pool.execute(
            `UPDATE payments SET 
                amount = ?,
                currency = ?,
                status = ?,
                customer_email = ?,
                paid_at = ?,
                gateway_response = ?,
                channel = ?,
                ip_address = ?,
                updated_at = NOW()
             WHERE reference = ?`,
            [...Object.values(paymentData), reference]
        );

        if (updateResult.affectedRows === 0) {
            console.warn(`Payment reference ${reference} not found in database`);
        }

        // 5. Get complete payment record
        const [paymentRecord] = await pool.execute(
            `SELECT * FROM payments WHERE reference = ?`,
            [reference]
        );

        // 6. Return success response
        res.status(200).json({
            status: true,
            message: "Payment verified successfully",
            data: {
                ...paymentRecord[0],
                amount: parseFloat(paymentRecord[0].amount)
            }
        });

    } catch (error) {
        console.error("Payment verification error:", {
            reference,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

        res.status(500).json({
            status: false,
            message: 'Payment verification failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Webhook endpoint (for Paystack to notify of payment updates)
router.post('/api/payments/webhook', async (req, res) => {
    const event = req.body;
    
    try {
        // Verify it's from Paystack
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                          .update(JSON.stringify(req.body))
                          .digest('hex');
        
        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(401).send('Unauthorized');
        }

        // Handle the event
        switch (event.event) {
            case 'charge.success':
                const { reference } = event.data;
                // Verify and update payment
                await paystack.verifyTransaction(reference);
                return res.sendStatus(200);
                
            default:
                return res.sendStatus(200);
        }
    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(500).json({
            status: false,
            message: 'Webhook processing failed'
        });
    }
});

module.exports = router;