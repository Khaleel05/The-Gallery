import React, { useEffect } from 'react'
import { useState } from 'react'
import './backdrop.css';
import { useNavigate } from 'react-router-dom';

//retrieving movie data fromt the TMDB API
function Backdrop() {
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

  //this function will handle the click event on a movie card
  const handleClick = (id) => {
    navigate(`/details/${id}`)
  }
  return (
    <div className ='backdropCards'  style={{color: 'white'}}>
      {movieList.map((movie)=>(
        <img
            key={movie.id}
            className="movie-backdrop"
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
            alt={movie.title}
            onClick={() => handleClick(movie.id)}
        />
      ))}
    </div>
  )
}

export default Backdrop