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

exports.checkLogin = (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM user WHERE Email = ?";

    db.query(sql, [email], async (err, data) => {
        if (err) return res.status(500).json({ error: "Server error: " + err });

        if (data.length > 0) {
            const hashedPassword = data[0].Password; // Get stored hashed password
            const validPassword = await bcrypt.compare(password, hashedPassword); // Compare passwords

            if (validPassword) {
                //create session
                const user = {
                    id: data[0].ID,
                    email: data[0].Email,
                    name: data[0].Name,
                    age: data[0].Age,
                    gender: data[0].Gender
                };

                req.session.user = user;

                return res.json({
                    status: "exists",
                    user: user

                }); // Login successful
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
    const { name, email, password, age, gender } = req.body;

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
                const insertQuery = "INSERT INTO user ( Email, Password, Name, Age, Gender) VALUES ( ?, ?, ?, ?, ?)";
                db.query(insertQuery, [ email, hashedPassword, name, age, gender], (err, result) => {
                    if (err) return res.status(500).json({ error: "Server error: " + err });

                    //create session for the new user
                    const user = {
                        id: result.insertID,
                        email: email,
                        name: name,
                        age: age,
                        gender: gender
                    }

                    req.session.user = user;

                    return res.json({
                        status: "notexists",
                        user: user
                    });
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Unexpected error: " + error.message });
    }
};


//handles logout user 
exports.logoutUser = (req, res) => {
    if (req.session.user && req.cookies.user_sid){
        res.clearCookie('user_sid');
        req.session.destroy((err) => {
            if (err){
                return res.status(500).json({error: "Error loging out"});
            }
            res.json({message: "logged out successfully" });
        });
    }else{
        res.json({message: "Already logged out"});
    }
}; 

//Get current user profile
exports.getUserProfile = (req, res) =>{
    if(req.session.user && req.cookies.user_sid){
        const userID = req.session.user.id;
        const query = "SELECT ID, Name, Email, Age, gender From user WHERE ID = ?";

        db.query(query, [userId], (err, data) => {
            if (err) return res.status(500).json({error: "server error:" + err});
            if(data.length > 0){
                return res.jso(data[0]);
            }else{
                return res.status(404).json({error:"user not found"});
            }
        });
    }else{
        res.status(401).json({error: "Not authenticated"})
    }
};

//Creating users favourites list. 
exports.setUserFavouriteList = async (req, res) =>{
    const{email, movieID, year, cast} = req.body;

    try{
        let user = {email};
        const emailBreakdown = user.split("@");
        let emailPrefix = toString(emailBreakdown[0]);
        //check if the table exist already
        const checkLikedTable = `SHOW TABLE LIKE ' ${emailPrefix}'`;
        db.query(checkLikedTable, (err, results) => {
            if (err) {
              console.error("Error checking table existence:", err);
              return;
            }
            if (results.length > 0) {
                console.log(`Table '${tableName}' exists.`);
                const insertQuery = `'INSERT INTO ${emailPrefix} ( movieID, year, cast) VALUES ( ?, ?, ?)'`;
                db.query(insertQuery, [movieID, year, cast])
              } else {
                console.log(`Table '${tableName}' does NOT exist.`);
                const createQuery=`CREATE TABLE '${emailPrefix}' (movieID INT, year INT, cast VARCHAR(255))`;
                db.query(createQuery)
                const insertQuery = `'INSERT INTO ${emailPrefix} ( movieID, year, cast) VALUES ( ?, ?, ?)'`;
                db.query(insertQuery, [movieID, year, cast])
                console.log(`${emailPrefix} table was created. `)
              }
        });
    }catch(error){
        res.json(error);

    }
};