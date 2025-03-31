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

exports.setGenreFavourite = async (req, res) =>{
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.session.user.email;
    const { selectedGenres } = req.body;
    console.log(userId);
    console.log(selectedGenres);
    try{
        //insert new Genres
        const genreInserts = selectedGenres.map(genre =>db.query(
            'INSERT INTO user_genres (user_id, genre_id, genre_name) VALUES (?, ?, ?)', 
            [userId, genre.id, genre.name]
        ));

        //wait for all inserts to complete
        await Promise.all(genreInserts);

        res.status(200).json({ message: 'Genres saved successfully' });
    }catch(error){
        console.error('Error saving genres: ', error);
        res.status(500).json({error: 'failed to save genres'});
    }
};

exports.getUserGenres = async (req, res) =>{
    try {
        // Check if user is authenticated
        if (!req.session.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.session.user.email;
        console.log(userId)

        // Query to fetch user's selected genres
        db.query(
            'SELECT DISTINCT genre_id FROM user_genres WHERE user_id = ?',
            [userId],
            (error, results) => {
                if (error) {
                    console.error('Error fetching user genres:', error);
                    return res.status(500).json({ error: 'Failed to fetch user genres' });
                }

                res.status(200).json(results);
            }
        );
    } catch (error) {
        console.error('Error in user genres route:', error);
        res.status(500).json({ error: 'Server error' });
    }
}