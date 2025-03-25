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
    initialiseTransaction,
    verifyTransaction,
    
};