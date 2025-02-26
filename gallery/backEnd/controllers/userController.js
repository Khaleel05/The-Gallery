// controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};
/*
//don't need this function any more.
exports.checkLogin = (req, res) => {
    const sql = "SELECT * FROM user WHERE Email = ? AND Password = ?";
    const values = [
        req.body.email,
        req.body.password
    ];

    db.query(sql, values, (err, data) => {
        if (err) return res.json("serverside app.post " + err);
        if (data.length > 0) {
            return res.json("exists");
        } else {
            return res.json("notexists");
        }
    });
};
*/

exports.checkLogin = (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM user WHERE Email = ?";

    db.query(sql, [email], async (err, data) => {
        if (err) return res.status(500).json({ error: "Server error: " + err });

        if (data.length > 0) {
            const hashedPassword = data[0].Password; // Get stored hashed password
            const validPassword = await bcrypt.compare(password, hashedPassword); // Compare passwords

            if (validPassword) {
                return res.json("exists"); // Login successful
            } else {
                return res.json("wrongpassword"); // Incorrect password
            }
        } else {
            return res.json("notexists"); // Email not found
        }
    });
};


// Register a new user
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const checkUserQuery = "SELECT * FROM user WHERE Email = ?";
        db.query(checkUserQuery, [email], async (err, data) => {
            if (err) return res.status(500).json({ error: "Server error: " + err });

            if (data.length > 0) {
                return res.json("exists");
            } else {
                // Hash password before storing it
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user
                const insertQuery = "INSERT INTO user ( Email, Password) VALUES ( ?, ?)";
                db.query(insertQuery, [ email, hashedPassword], (err, result) => {
                    if (err) return res.status(500).json({ error: "Server error: " + err });
                    return res.json("notexists");
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Unexpected error: " + error.message });
    }
};