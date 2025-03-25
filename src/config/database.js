const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306, // Default MySQL port is 3306
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0,
});

// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    }
    console.log('Successfully connected to MySQL database');
    connection.release();
});


// Export the pool for use in other files
module.exports = pool.promise(); // Use promises for async/await support