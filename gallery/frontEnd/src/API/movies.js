import React, { useEffect } from 'react'
import { useState } from 'react'
import './movies.css';

//retrieving movie data fromt the TMDB API
function Movies() {
    //this is the variable to grap the API key from an .env file (more secure)
    const apiKey = process.env.REACT_APP_TMDB_API_KEY

    //for now this is just showing me if the api key is being stored properly, addressing this issue later 
    console.log('API key:', apiKey);
    //when the Api is stored properly i will replace it into the fetch call. 
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`


    //create a list that is will be filled with the mocie object from the api. 
    const [movieList, setMovieList] = useState([])



    const getmovie =() => {
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=ac8e81688a0f465351ee8afbfd35c253`)
           .then(res => res.json())
           .then(json => setMovieList(json.results))
           .catch(error => console.error('Error:', error))
    }

    useEffect (() => {
        getmovie()
    },[])

    

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
        />
      ))}
    </div>
  )
}

export default Movies
