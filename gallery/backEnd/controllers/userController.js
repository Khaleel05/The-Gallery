// controllers/userController.js
const db = require('../config/db');

exports.getAllUsers = (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

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