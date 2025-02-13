require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes'); // Import the new movie route

console.log(process.env.REACT_APP_TMDB_API_KEY);

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/api', movieRoutes); // Use the movie route under /api

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app; // Export the app for use in server.js