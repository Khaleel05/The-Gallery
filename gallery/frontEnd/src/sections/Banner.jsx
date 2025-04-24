import React, { useState, useEffect } from 'react';
import Style from './banner.module.css';
import Backdrop from '../API/Backdrop';
import { useNavigate } from 'react-router-dom';

function Banner() {
  const navigate = useNavigate();
  //state to track the current image index
  const [currentIndex, setCurrentIndex] = useState(0);
  //state to store movie data including images, titles, and overviews
  const [movies, setMovies] = useState([]);
  //state for fade effect
  const [fadeIn, setFadeIn] = useState(true);
  
  //function to handle receiving movie data from Backdrop
  const handleMovieData = (movieData) => {
    setMovies(movieData);
  };

  //auto-transition effect
  useEffect(() => {
    if (movies.length === 0) return;
    
    const transitionImage = () => {
      // Start fade out
      setFadeIn(false);
      
      //after fade out, change image and start fade in
      const fadeOutTimer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setFadeIn(true);
      }, 1000); // 1 second for fade out
      
      return fadeOutTimer;
    };
    
    const interval = setInterval(transitionImage, 15000); // 15 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, [movies.length, currentIndex]);
  
  // Handle click on a movie banner
  const handleClick = (id) => {
    navigate(`/details/${id}`);
  };
  
  // Early return if no movies
  if (movies.length === 0) {
    return <div className={Style.bannerContainer}><Backdrop onMovieData={handleMovieData} /></div>;
  }
  
  const currentMovie = movies[currentIndex] || {};
  
  return (
    <div 
      className={Style.bannerContainer} 
      onClick={() => handleClick(currentMovie.id)} 
    >
      <div className={`${Style.bannerImage} ${fadeIn ? Style.fadeIn : Style.fadeOut}`}>
        {currentMovie.backdrop_path && (
          <img 
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
          />
        )}
      </div>
      
      <div className={Style.infoOverlay}>
        <h1>{currentMovie.title}</h1>
        <p>{currentMovie.overview}</p>
      </div>
    </div>
  );
}

export default Banner;