const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Create test user
router.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, name) VALUES (?, ?)',
      [email, name]
    );

    res.status(201).json({
      status: true,
      message: 'Test user created',
      user: { id: result.insertId, email, name }
    });
  } catch (error) {
    res.status(500).json({ 
      status: false,
      message: 'User creation failed',
      error: error.message 
    });
  }
});

module.exports = router;