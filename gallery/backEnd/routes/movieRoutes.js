require('dotenv').config();
const db = require('../config/db');
const express = require('express');
const router = express.Router();
const axios = require('axios');

const util = require('util');

const apiKey = process.env.REACT_APP_TMDB_API_KEY

//console.log(process.env.REACT_APP_TMDB_API_KEY)

//console.log('apiKey',apiKey)


router.get('/api/movie', (req, res) => {
  res.json(movies);
});

//Route to fetch movies from the TMDB API
router.get('/movies', async (req, res) => {
    try {
      //console.log('Api recieved');
      const genreId = req.query.genreId;
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=`;
        if (genreId) {
          url += `&with_genres=${genreId}`;
        }
        const response = await axios.get(url);
        res.json(response.data.results); // Send the movie data back to the frontend
    } catch (error) {
        console.error('Error fetching movies from TMDB:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Route to fetch movie details by ID
router.get('/movies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
      const response = await axios.get(url);
      res.json(response.data); // Send the movie details back to the frontend
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Failed to fetch movie details' });
    }
  });
  

// Route to fetch trailers by movie ID
router.get('/movies/:id/videos', async (req, res) => {
    try {
      const { id } = req.params;
      const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`;
      const response = await axios.get(url);
      res.json(response.data); // Send the trailers back to the frontend
    } catch (error) {
      console.error('Error fetching trailers:', error);
      res.status(500).json({ error: 'Failed to fetch trailers' });
    }
});
  
// Route to fetch streaming providers by movie ID
router.get('/movies/:id/watch/providers', async (req, res) => {
    try {
      const { id } = req.params;
      const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`;
      const response = await axios.get(url);
      res.json(response.data); // Send the streaming providers back to the frontend
    } catch (error) {
      console.error('Error fetching streaming providers:', error);
      res.status(500).json({ error: 'Failed to fetch streaming providers' });
    }
});

//route to fetch movie recommendations by the movie ID
router.get('/movie/:id/recommendations', async(req, res) => {
    try {
        const { id } = req.params;
        const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data); // Send the recommended movies data back to the frontend
    } catch (error) {
        console.error('Error fetching movies recommendations :', error);
        res.status(500).json({ error: 'Failed to fetch recommended movies' });
    }
});

//search route 
router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=ac8e81688a0f465351ee8afbfd35c253&query=${query}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// User Favorites routes
router.post('/user/favorites/add', async (req, res) => {
  try {

    // Check if user is authenticated and log the session
    console.log("Session data:", req.session);
    console.log('id: ', req.session.user.email)
    // Check if user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.session.user.email;
    const { movieId, title, posterPath, voteAverage } = req.body;

    // Validate required fields
    if (!movieId || !title) {
      return res.status(400).json({ error: 'Movie ID and title are required' });
    }

    // Check if movie already exists in favorites
    const existingFavorite = await db.query(
      'SELECT * FROM user_favorites WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );

    console.log(userId)
    console.log('(finding existing movies)Available properties:', Object.keys(existingFavorite));
    console.log('(finding existing movies)fields:', existingFavorite.values);

    if (existingFavorite._results.length > 0) {
      console.log('alredy in favourites')
      return res.status(200).json({ message: 'Movie already in favorites' });
    }

    // Add to favorites
    await db.query(
      'INSERT INTO user_favorites (user_id, movie_id, title, poster_path, vote_average, added_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, movieId, title, posterPath, voteAverage]
    );

    console.log('added movie to db')
    res.status(201).json({ message: 'Movie added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add movie to favorites' });
  }
});

// Remove from favorites
router.delete('/user/favorites/remove/:movieId', (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userId = req.session.user.email;
  const { movieId } = req.params;

  console.log(`Removing movie ${movieId} from favorites for user ${userId}`);

  // Execute the DELETE query with a callback
  db.query(
    'DELETE FROM user_favorites WHERE user_id = ? AND movie_id = ?',
    [userId, movieId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }

      console.log('Query results:', results); // Debugging output

      // Check if any rows were affected
      if (results.affectedRows > 0) {
        return res.status(200).json({ message: 'Movie removed from favorites' });
      } else {
        return res.status(404).json({ message: 'Movie not found in favorites' });
      }
    }
  );
});

// Check if movie is in favorites
router.get('/user/favorites/check/:movieId', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ isFavorite: false });
    }

    const userId = req.session.user.email;
    const { movieId } = req.params;

    console.log('Checking favorites for user:', userId);
    console.log('Movie ID:', movieId);

    // Execute the database query using a connection from the pool
    db.query(
      'SELECT * FROM user_favorites WHERE user_id = ? AND movie_id = ?',
      [userId, movieId],
      (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ error: 'Database query failed' });
        }

        console.log('Query results:', results); // Debugging output

        const isFavorite = results.length > 0;
        res.status(200).json({ isFavorite });
      }
    );

  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

// Get all user favorites
router.get('/user/favorites', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.session.user.email;
    console.log(userId);

    // Get all favorites for the user
    db.query(
      'SELECT * FROM user_favorites WHERE user_id = ? ORDER BY added_at DESC',
      [userId],
      (error, results) => {
        if (error) {
          console.error('Error fetching favorites:', error);
          return res.status(500).json({ error: 'Failed to fetch favorites' });
        }

        console.log('Favorites retrieved:', results); // Added logging for debugging
        res.status(200).json(results);
      }
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});



module.exports = router;
