import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


function MovieDetails(){

    //const process = require('process');
    const { id } = useParams();

    console.log({id});

    // replace 'YOUR_API_KEY' with your actual API key
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=ac8e81688a0f465351ee8afbfd35c253`;

    // state to hold movie data
    const [movie, setMovie] = useState(null);

    // make an API request to get movie details with id
    const getMovieDetails = () => {
        fetch(url)
       .then(response => response.json())
       .then(data => setMovie(data))
       .catch(error => console.error('Error:', error));
    }

    // fetch movie details when id changes (useEffect hook) and set it to the state variable movie
    useEffect(() => {
        getMovieDetails();
    }, [id])

    console.log({movie})

    // if movie data is not loaded yet, display a loading message
    if (!movie) return <p>Loading movie details...</p>

    // render movie details
    return (
        <div style={{color: 'white'}}>
            <h1>{movie.title}</h1>
            <p>Release Date: {movie.release_date}</p>
            <p>Overview: {movie.overview}</p>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        </div>
    )
}

export default MovieDetails;
