import React, { useEffect } from 'react'
import { useState } from 'react'
import './movies.css';
import { useNavigate } from 'react-router-dom';



function Movies({Gkey}) {
  const navigate = useNavigate();
  const [movieList, setMovieList] = useState([]);

  // Fetch movies from your backend
  const getMovies = () => {
    fetch('http://localhost:8081/api/movies') // Call your backend route
      .then((res) => res.json())
      .then((data) => setMovieList(data))
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    getMovies();
  }, []);

  // Handle click on a movie card
  const handleClick = (id) => {
    navigate(`/details/${id}`);
    console.log(id);
  };

  return (
    <div className="MovieCards" style={{ color: 'white' }}>
      {movieList.map((movie) => (
        <img
          key={movie.id}
          className="movie-image"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          onClick={() => handleClick(movie.id)}
        />
      ))}
    </div>
  );
}





/*
//retrieving movie data fromt the TMDB API
function Movies() {
  const navigate = useNavigate();
  //this is the variable to grap the API key from an .env file (more secure)
  const apiKey = process.env.REACT_APP_TMDB_API_KEY

  //for now this is just showing me if the api key is being stored properly, addressing this issue later 
  console.log('API key:', apiKey);
  //when the Api is stored properly i will replace it into the fetch call. 
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`


  //create a list that is will be filled with the mocie object from the api. 
  const [movieList, setMovieList] = useState([])

  //this will hold the selected movie
  const [selectedMovie, setSelectedMovie] = useState(null)

  //this function will fetch the movie data from the API
  //this function will be called when the component mounts (useEffect) or when the movieList changes (useEffect)

  const getmovie =() => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=ac8e81688a0f465351ee8afbfd35c253`)
   .then(res => res.json())
   .then(json => setMovieList(json.results))
   .catch(error => console.error('Error:', error))
  }

  useEffect (() => {
    getmovie()
  },[])


  
  //const handleClick = (movie) => {
    //setSelectedMovie(movie)
  //}
  

  //this function will handle the click event on a movie card
  const handleClick = (id) => {
    navigate(`/details/${id}`)
  }
    

  //display what movies have been retrieved. 
  console.log(movieList)

  return (
    <div className ='MovieCards'  style={{color: 'white'}}>
      {movieList.map((movie)=>(
        <img
            key={movie.id}
            className="movie-image"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            onClick={() => handleClick(movie.id)}
        />
      ))}
    </div>
  )
}
*/

export default Movies
