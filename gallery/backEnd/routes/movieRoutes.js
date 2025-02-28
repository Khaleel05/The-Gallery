require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiKey = process.env.REACT_TMDB_API_KEY


router.get('/api/movie', (req, res) => {
  res.json(movies);
});

//Route to fetch movies from the TMDB API
router.get('/movies', async (req, res) => {
    try {
      const genreId = req.query.genreId;
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=ac8e81688a0f465351ee8afbfd35c253&with_genres=`;
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
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=ac8e81688a0f465351ee8afbfd35c253`;
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
      const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=ac8e81688a0f465351ee8afbfd35c253`;
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
      const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=ac8e81688a0f465351ee8afbfd35c253`;
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
        const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=ac8e81688a0f465351ee8afbfd35c253`;
        const response = await axios.get(url);
        res.json(response.data); // Send the recommended movies data back to the frontend
    } catch (error) {
        console.error('Error fetching movies recommendations :', error);
        res.status(500).json({ error: 'Failed to fetch recommended movies' });
    }
});

module.exports = router;
