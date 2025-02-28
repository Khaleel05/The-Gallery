import React, { useRef, useState, useEffect } from 'react'
import Movies from '../API/movies'
import Style from './carousel.module.css'

//the component containing the movies and lining them up. 
const Carousel = ({genre, movies, handleClick}) => {

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  //console.log(filteredMovies)

  return (
    <div style={{/*border:'solid 1px blue'*/}}>
      <h2 style={{color: 'white', fontFamily: 'sans-serif', marginLeft: '1.2em'}}>{genre}</h2>
      <div  className={Style.carousel} ref={carouselRef}>
        {/* Vertically centered navigation icons */}
      <ion-icon 
        className={`${Style.carouselIcon} ${Style.leftIcon}`}
        name="arrow-back-circle-outline" 
        onClick={scrollLeft}
      ></ion-icon>
      
      <ion-icon 
        className={`${Style.carouselIcon} ${Style.rightIcon}`}
        name="arrow-forward-circle-outline" 
        onClick={scrollRight}
      ></ion-icon>
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className={Style.movieCard}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                onClick={() => handleClick(movie.id)}
                className={Style.movieImage}
              />
              <p className={Style.movieTitle}>{movie.title}</p>
            </div>
          ))
        ) : (
          <p style={{color: 'white', padding: '20px'}}>No movies found for this genre</p>
        )}
      </div>
    </div>
  )
}

export default Carousel
