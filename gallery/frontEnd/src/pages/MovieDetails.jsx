import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../sections/Header'


function MovieDetails(){

    //const process = require('process');
    const { id } = useParams();

    console.log({id});

    // replace 'YOUR_API_KEY' with your actual API key
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=ac8e81688a0f465351ee8afbfd35c253`;
    const streamingServiceUrl = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=ac8e81688a0f465351ee8afbfd35c253`
    const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=ac8e81688a0f465351ee8afbfd35c253`

    // state to hold movie data
    const [movie, setMovie] = useState(null);
    const [streamingService, setStreamingServices] = useState(null)
    const [trailer, setTrailer] = useState(null)

    // make an API request to get movie details with id
    const getMovieDetails = () => {
        fetch(url)
       .then(response => response.json())
       .then(data => setMovie(data))
       .catch(error => console.error('Error:', error));
    }

    //get trailers 
    const getTrailer = () => {
        fetch(videosUrl)
        .then(res => res.json())
        .then(data => {
            //filter the results array to only include objects with the Type "Trailer"
            const trailerResults = data.results.find(item => item.type === "Trailer");
            //set the filtered results to the state.
            setTrailer(trailerResults);
        })
        .catch(error => console.error('Error:', error));
    }

    //make an API request to get the streaming services that host the movie.
    const getStreamingService = () => {
        fetch(streamingServiceUrl)
        .then(res => res.json())
        .then(data => setStreamingServices(data))
        .catch(error => console.error('Error:', error));
    }

    // fetch movie details when id changes (useEffect hook) and set it to the state variable movie
    useEffect(() => {
        getMovieDetails();
        getStreamingService();
        getTrailer();
    }, [id])

    console.log({movie})
    console.log({streamingService})
    console.log({trailer})

    // if movie data is not loaded yet, display a loading message
    if (!movie) return <p>Loading movie details...</p>

    // render movie details
    return (
        <div style={{position:'absolute', top: '5rem'}}>
            <Header/>
            <div style={{color: 'white'}}>
                <h1>{movie.title}</h1>
                <p>Release Date: {movie.release_date}</p>
                <p>Overview: {movie.overview}</p>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className='video-container'>
                    <iframe 
                    width="560" 
                    height="315" 
                    src={`https://www.youtube.com/embed/${trailer.key}?si=zqeSvBhlLTXsMnyC`}
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen='false'>
                    </iframe>


                </div>
            </div>
        </div>
    )
}

export default MovieDetails;

/*
<iframe 
                width="560" 
                height="315" 
                src={`https://www.youtube.com/embed/${trailer.key}?si=zqeSvBhlLTXsMnyC`}
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen='false'>
                </iframe>
*/
