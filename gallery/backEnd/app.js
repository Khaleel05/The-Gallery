const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app; // Export the app for use in server.js