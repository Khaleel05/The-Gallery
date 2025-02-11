import React, { useEffect, useCallback } from 'react'
import { useState } from 'react'
import './movies.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'



function RecMovies(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [recMovieList, setRecMovieList] = useState([]);
  
    // Fetch movies recommendations from your backend
    const getRecMovies = useCallback(() => {
        fetch(`http://localhost:8081/api/movie/${id}/recommendations`)
          .then((res) => res.json())
          .then((data) => {
            console.log("API Response:", data); // Debugging output
            setRecMovieList(Array.isArray(data.results) ? data.results : []); // ✅ Extract `results`
        }).catch((error) => {
            console.error("Error fetching recommendations:", error);
        });
    }, [id]);
  
    useEffect(() => {
      getRecMovies();
    }, [getRecMovies]);
  
    // Handle click on a movie card
    const handleClick = (movieId) => {
      if (id !== movieId) {
        navigate(`/details/${movieId}`);
        console.log(movieId); // Log the movie ID for debugging purposes, if needed.
      }
    };
  
    return (
      <div className="MovieCards" style={{ color: 'white' }}>
        {recMovieList.length > 0 ? (
        recMovieList.map((movie) => (
          <img
            key={movie.id} // ✅ `movie.id` should now exist
            className="movie-image"
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "default-image.jpg"} // ✅ Handle undefined poster
            alt={movie.title || "No title available"} // ✅ Handle missing title
            onClick={() => handleClick(movie.id)}
          />
        ))
      ) : (
        <p>No recommendations available</p>
      )}
      </div>
    );  
}

export default RecMovies;