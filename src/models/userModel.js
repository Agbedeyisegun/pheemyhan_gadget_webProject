
//USING MYSQL DATABASE

const db = require('../config/database');

class User {
    // Create a new user
    static async create(firstName, lastName, emailAddress, amount) {
        const [result] = await db.execute(
            'INSERT INTO user (first_name, last_name, email_address, amount) VALUES (?, ?, ?, ?)',
            [firstName, lastName, emailAddress, amount]
        );
        return result.insertId; // Return the ID of the newly created user
    }

    // Find a user by email address
    static async findByEmail(emailAddress) {
        const [rows] = await db.execute(
            'SELECT * FROM user WHERE email_address = ?',
            [emailAddress]
        );
        return rows[0]; // Return the first matching user
    }

    // Update a user's amount
    static async updateAmount(emailAddress, amount) {
        const [result] = await db.execute(
            'UPDATE user SET amount = ? WHERE email_address = ?',
            [amount, emailAddress]
        );
        return result.affectedRows > 0; // Return true if the update was successful
    }

    // Delete a user by email address
    static async deleteByEmail(emailAddress) {
        const [result] = await db.execute(
            'DELETE FROM user WHERE email_address = ?',
            [emailAddress]
        );
        return result.affectedRows > 0; // Return true if the deletion was successful
    }

    // Get all users
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM user');
        return rows; // Return all users
    }
}

module.exports = User;