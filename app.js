const express = require('express');
require('dotenv').config();


// NOT NEEDED const db = require('./src/config/db');


// IMPORT ROUTES
const userRoutes = require('./src/routes/userRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');


const app = express();

// connect to database

//this is for mongoose connetion  "connectDB();"

// Middleware

app.use(express.json());

// Routes 

app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);


// Health check endpoint
app.get('/health', async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.status(200).json({ 
        status: 'healthy',
        database: 'connected'
      });
    } catch (err) {
      res.status(500).json({
        status: 'unhealthy',
        database: 'disconnected',
        error: err.message
      });
    }
});
  



// Root route handler (NEW)
app.get('/', (req, res) => {
    res.json({
      status: 'server is running',
      message: 'Pheemyhan Payment API',
      endpoints: {
        initialize: 'POST /api/payments/initialize',
        verify: 'GET /api/payments/verify/:reference'
      }
    });
  });
  
  // 404 handler (NEW)
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
  



// Start server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

