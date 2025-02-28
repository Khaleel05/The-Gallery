import React, { useEffect } from 'react';
import { useState } from 'react';
import './backdrop.css';
import { useNavigate } from 'react-router-dom';

function Backdrop({ onMovieData }) {
  const navigate = useNavigate();
  const [movieList, setMovieList] = useState([]);

  // Fetch movies from your backend
  const getMovies = () => {
    fetch('http://localhost:8081/api/movies') // Call your backend route
      .then((res) => res.json())
      .then((data) => {
        setMovieList(data);
        // Pass the full movie data to the parent component
        if (onMovieData && data.length > 0) {
          onMovieData(data);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    getMovies();
  }, []);

  // Handle click on a movie backdrop
  const handleClick = (id) => {
    navigate(`/details/${id}`);
  };

  // This component doesn't need to render anything since Banner will handle it
  return null;
}

export default Backdrop;