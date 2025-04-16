const db = require('../config/db');
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.REACT_APP_TMDB_API_KEY;


//Function to get users' favourites 
const getUserFavourites = async (userId)=>{
    return new Promise((resolve, reject)=>{
        db.query (
            'SELECT * FROM user_favorites WHERE user_id = ?',
            [userId],
            (error, results)=>{
                if(error){
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
};

//get Movies details fromt TMDB API 
const getMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for movie ${movieId}:`, error);
        return null;
    }
};

//get content based recommendatiosn for a user. 
exports.getContentBasedRecommendations = async (req, res) => {
    try{
        // Check if user is authenticated
        if (!req.session.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.session.user.email;
        
        // Get user's favorite movies
        const favorites = await getUserFavourites(userId);


        if (favorites.length === 0) {
            return res.status(200).json({ 
                message: 'No favorites found to base recommendations on',
                recommendations: [] 
            });
        }

        // Extract movie details (genres and cast) from each favorite
        const movieProfiles = [];
        for (const favorite of favorites) {
            const details = await getMovieDetails(favorite.movie_id);
            if (details) {
                // Extract genres
                const genres = details.genres.map(genre => genre.id);
                
                // Extract top 5 cast members
                const cast = details.credits.cast
                    .slice(0, 5)
                    .map(actor => actor.id);
                
                movieProfiles.push({
                    movieId: favorite.movie_id,
                    genres,
                    cast
                });

            }
        }
        //collect all unique genre and cast members 
        const allGenres = new Set();
        const allCast = new Set();

        movieProfiles.forEach(profile =>{
            profile.genres.forEach(genreId => allGenres.add(genreId));
            profile.cast.forEach(actorId => allCast.add(actorId));
        });

        //find similar maovies based on genres and cast
        const recommendedMovies = new Map(); //using a map to keep track of scores. 

        //for each genre, get movies
        for(const genreId of allGenres){
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
            );
            for (const movie of response.data.results){
                //skip movies that are already in favourites
                if(favorites.some(fav => parseInt(fav.movie_id)===movie.id)){
                    continue;
                }

                //calculate score based on matching genres
                const score = movie.genre_ids. filter(id => allGenres.has(id)).length;
                
                //update score in map 
                if (recommendedMovies.has(movie.id)){
                    recommendedMovies.set(movie.id, {
                        ...recommendedMovies.get(movie.id),
                        score: recommendedMovies.get(movie.id).score+score

                    });
                }else{
                    recommendedMovies.set(movie.id, {
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average,
                        score: score
                    });
                }
            }
        }
        // For each cast member, boost scores of movies they appear in
        for (const actorId of allCast) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}`
            );
            
            for (const movie of response.data.cast) {
                // Skip movies that are already in favorites
                if (favorites.some(fav => parseInt(fav.movie_id) === movie.id)) {
                    continue;
                }
                
                // Boost score for cast match
                if (recommendedMovies.has(movie.id)) {
                    recommendedMovies.set(movie.id, {
                        ...recommendedMovies.get(movie.id),
                        score: recommendedMovies.get(movie.id).score + 1
                    });
                } else {
                    recommendedMovies.set(movie.id, {
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average,
                        score: 1
                    });
                }
            }
        }
        // Convert map to array and sort by score
        const recommendations = Array.from(recommendedMovies.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Return top 10 recommendations
            
        res.status(200).json({
            message: 'Recommendations retrieved successfully',
            recommendations
        });
    }catch(error){
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};