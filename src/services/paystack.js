const axios = require('axios');
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https;//api.paystack.io';

// initialise a transaction 
const initialiseTransaction = async (email, amount) => {
    try {
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialise`,
            {
                email,
                amount: amount * 100, // Paystack expects amount in kobo 
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error initialising transaction:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// verify this transaction 

const verifyTransaction = async (reference) => {
    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error verifying transcation:', error.response ? error.response.data : error.message);
        throw error;
    }
};


module.exports = {
    /**
     * Initialize a Paystack transaction
     * @param {string} email - Customer email
     * @param {number} amount - Amount in kobo
     * @returns {Promise<Object>} Paystack response
     */
    initialiseTransaction: async (email, amount) => {
      try {
        const response = await paystack.post('/transaction/initialize', {
          email,
          amount,
          callback_url: config.paymentCallbackUrl
        });
        return response.data;
      } catch (error) {
        console.error('Paystack initialization error:', error.response?.data || error.message);
        throw new Error('Failed to initialize payment');
      }
    },
  
    /**
     * Verify a Paystack transaction
     * @param {string} reference - Transaction reference
     * @returns {Promise<Object>} Verification response
     */
    verifyTransaction: async (reference) => {
      try {
        const response = await paystack.get(`/transaction/verify/${encodeURIComponent(reference)}`);
        return response.data;
      } catch (error) {
        console.error('Paystack verification error:', {
          reference,
          error: error.response?.data || error.message
        });
        throw new Error('Payment verification failed');
      }
    }
  };