import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../sections/Header'
import Style from './movieDetails.module.css'
import RecMovies from '../API/recMovies'
import { useNavigate } from 'react-router-dom';



function MovieDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
  
    // State to hold movie data
    const [movie, setMovie] = useState(null);
    const [streamingService, setStreamingServices] = useState(null);
    const [trailer, setTrailer] = useState(null);
    // State to manage searched movies
      const [searchedMovies, setSearchedMovies] = useState([]);
  
    // Fetch movie details from your backend
    const getMovieDetails = () => {
      fetch(`http://localhost:8081/api/movies/${id}`) // Call your backend route
        .then((response) => response.json())
        .then((data) => setMovie(data))
        .catch((error) => console.error('Error:', error));
    };
  
    // Fetch trailers from your backend
    const getTrailer = () => {
      fetch(`http://localhost:8081/api/movies/${id}/videos`) // Call your backend route
        .then((res) => res.json())
        .then((data) => {
          // Filter the results array to only include objects with the type "Trailer"
          const trailerResults = data.results.find((item) => item.type === 'Trailer');
          // Set the filtered results to the state
          setTrailer(trailerResults);
        })
        .catch((error) => console.error('Error:', error));
    };
  
    // Fetch streaming services from your backend
    const getStreamingService = () => {
      fetch(`http://localhost:8081/api/movies/${id}/watch/providers`) // Call your backend route
        .then((res) => res.json())
        .then((data) => setStreamingServices(data))
        .catch((error) => console.error('Error:', error));
    };
  
    // Fetch movie details, trailers, and streaming services when the id changes
    useEffect(() => {
      getMovieDetails();
      getStreamingService();
      getTrailer();
    }, [id]);

    // Handle click on a movie card
    const handleClick = (id) => {
        navigate(`/details/${id}`);
        console.log(id);
    };
  
    // If movie data is not loaded yet, display a loading message
    if (!movie) return <p>Loading movie details...</p>;


  
    // Render movie details
    return (
      <div style={{ position: 'absolute', top: '5rem' }}>
        <Header setSearchedMovies={setSearchedMovies}/>
        <div id="Pbody">
            {searchedMovies.length > 0 ? (
            <div className={Style.moviegrid}>
                {searchedMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                    <img
                    key={movie.id}
                    className="movie-image"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    onClick={() => handleClick(movie.id)}
                    />
                    <p>{movie.title}</p>
                </div>
                ))}
            </div>
            ) : (
            <>
                <div style={{ color: 'white' }}>
                <div className='DTitle' style={{ bottomBoarder:'solid 1px white'}}>
                    <h1>{movie.title}</h1>
                </div>
                <div style={{border:'solid 1px red', width:'100%', height: 'auto', display: 'inline-flex', justifyContent:'space-evenly'}}>
                    <div className={Style.DImage} /*style={{float:'left', padding:'1rem', margin:'1rem', border:'solid 1px red', display:'inline-block'}}*/>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{width: '90%'}} />
                    </div>
                    <div className="video-container" style={{border:'solid 1px red',margin:'1rem', display:'inline-block', alignItems: 'center', justifyContent: 'center'}}>
                        {trailer && (
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${trailer.key}?si=zqeSvBhlLTXsMnyC&autoplay=1&mute=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                        )}
                    </div>
                    <div style={{border:'solid 1px blue', width:'30%', padding:'1rem', margin: '1rem', justifyContent:'center', alignItems:'center'}}>
                        <p>Release Date: {movie.release_date}</p>
                        <p>Overview: {movie.overview}</p>
                    </div>
                </div>
                <div>
                    <h2 style={{borderBottom:'solid 1px white'}}>Suggested</h2>
                    <div>
                        <RecMovies/>
                    </div>
                </div>
            </div>
          </>
        )}
      </div>
        
      </div>
    );
  }


/*
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
*/

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
