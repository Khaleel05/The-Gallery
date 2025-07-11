require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sessionStore = require('./config/sessionStore'); 
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes'); // Import the new movie route
const recommendationRoutes = require('./routes/recommendationRoutes');


//console.log(process.env.REACT_APP_TMDB_API_KEY);

const app = express();

//set up middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:3000', //The React apps URL.
    credentials: true //Allows cookies to be sent.
}));

//set up session middleware
app.use(session({
    key: 'user_sid', //Name of the cookie
    secret: process.env.SESSION_SECRET || 'my-strong-session-secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true 
    }

}));

app.use(express());

//Clear cookie if no session exists
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user){
        res.clearCookie('user_sid');
    }
    next()
});

const sessionChecker = (req, res, next) =>{
    if (req.session.user && req.cookie.user_sid){
        next();
    }else{
        res.status(401).json({authenticated:false, message: 'NOT Authenticated'})
        console.log('failed to authenticate')
        console.log(req.session.user)
    }
};

// Routes
app.use('/user', userRoutes);
app.use('/api', movieRoutes); // Use the movie route under /api
app.use('/api/recommendations', recommendationRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//session route check
app.get('/user/checkAuth', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.json({ 
            authenticated: true, 
            user: {
                id: req.session.user.id,
                email: req.session.user.email,
                name: req.session.user.name,
                age: req.session.user.age,
                gender: req.session.user.gender
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = app; // Export the app for use in server.js