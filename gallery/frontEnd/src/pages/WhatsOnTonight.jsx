import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../sections/Header';
import styles from './WhatsOnTonight.module.css';
import GenreApiList from '../data/GenreApiList';
import streamingProviders from '../data/StreamingProvider';

function WhatsOnTonight() {
  const navigate = useNavigate();
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const cardRef = useRef(null);

  // Movie and filter states
  const [randomMovie, setRandomMovie] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [yearRange, setYearRange] = useState({ min: 1980, max: 2025 });
  const [streamingProvider, setStreamingProvider] = useState('');
  
  // Get a random movie based on filters
  const getRandomMovie = async () => {
    setLoading(true);
    setIsRotating(true);
    
    // Flip the card
    setIsFlipped(true);
    
    try {
      // Construct the base URL for the API call
      let url = `http://localhost:8081/api/movies?random=true`;
      
      // Add filters to the API call if selected
      if (selectedGenre) {
        url += `&genreId=${selectedGenre}`;
      }
      
      if (yearRange.min !== 1980 || yearRange.max !== 2025) {
        url += `&year_gte=${yearRange.min}&year_lte=${yearRange.max}`;
      }
      
      if (streamingProvider) {
        url += `&with_watch_providers=${streamingProvider}`;
      }
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        // Handle unauthorized access
        navigate('/login', { state: { from: '/whats-on-tonight' } });
        return;
      }
      
      const data = await response.json();
      
      // Get a random movie from the results
      const randomIndex = Math.floor(Math.random() * data.length);
      const selectedMovie = data[randomIndex] || null;
      
      // If we got a movie, fetch its details
      if (selectedMovie) {
        const detailsResponse = await fetch(`http://localhost:8081/api/movies/${selectedMovie.id}`, {
          credentials: 'include'
        });
        const movieDetails = await detailsResponse.json();
        setRandomMovie(movieDetails);
      } else {
        setRandomMovie(null);
      }
    } catch (error) {
      console.error('Error fetching random movie:', error);
      setRandomMovie(null);
    } finally {
      // End the rotation animation after a delay
      setTimeout(() => {
        setIsRotating(false);
        setIsFlipped(false);
        setLoading(false);
      }, 1500);
    }
  };

  // Handle year range changes
  const handleYearChange = (type, value) => {
    setYearRange(prev => ({
      ...prev,
      [type]: parseInt(value)
    }));
  };

  // Navigate to movie details
  const handleMovieClick = () => {
    if (randomMovie) {
      navigate(`/details/${randomMovie.id}`);
    }
  };

  //Flip the card 
  const handleDoubleClick = () =>{
    setIsFlipped(!isFlipped);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.container}>
      <Header setSearchedMovies={setSearchedMovies} />
      
      <div className={styles.content}>
        <h1 className={styles.title}>What's On Tonight?</h1>
        <p className={styles.subtitle}>Let us pick a movie for you to watch tonight!</p>
        
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label htmlFor="genre" className={styles.filterLabel}>Genre</label>
            <select 
              id="genre" 
              className={styles.select}
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">Any Genre</option>
              {GenreApiList.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Year Range</label>
            <div className={styles.yearInputs}>
              <input 
                type="number" 
                className={styles.yearInput}
                min="1900" 
                max="2025" 
                value={yearRange.min}
                onChange={(e) => handleYearChange('min', e.target.value)}
              />
              <span>to</span>
              <input 
                type="number" 
                className={styles.yearInput}
                min="1900" 
                max="2025" 
                value={yearRange.max}
                onChange={(e) => handleYearChange('max', e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="provider" className={styles.filterLabel}>Streaming Service</label>
            <select 
              id="provider" 
              className={styles.select}
              value={streamingProvider}
              onChange={(e) => setStreamingProvider(e.target.value)}
            >
              <option value="">Any Service</option>
              {streamingProviders.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          className={styles.findButton} 
          onClick={getRandomMovie}
          disabled={loading}
        >
          {loading ? 'Finding...' : 'Find Me Something to Watch!'}
        </button>
        
        <div className={styles.cardContainer}>
          <div 
            ref={cardRef}
            className={`${styles.card} ${isRotating ? styles.rotating : ''} ${isFlipped ? styles.flipped : ''}`}
            onClick={handleDoubleClick}
            ondblclick={handleMovieClick}
          >
            {randomMovie ? (
              <>
                <div className={styles.cardFront}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`} 
                    alt={randomMovie.title}
                    className={styles.poster}
                  />
                </div>
                <div className={styles.cardBack}>
                  <h2 className={styles.movieTitle}>{randomMovie.title}</h2>
                  {randomMovie.tagline && (
                    <p className={styles.tagline}>"{randomMovie.tagline}"</p>
                  )}
                  <div className={styles.movieMeta}>
                    <span className={styles.releaseDate}>{formatDate(randomMovie.release_date)}</span>
                    {randomMovie.runtime && <span className={styles.runtime}>{randomMovie.runtime} min</span>}
                    {randomMovie.vote_average && (
                      <span className={styles.rating}>
                        <span className={styles.star}>★</span> {randomMovie.vote_average.toFixed(1)}/10
                      </span>
                    )}
                  </div>
                  <p className={styles.overview}>{randomMovie.overview}</p>
                  <div className={styles.genres}>
                    {randomMovie.genres && randomMovie.genres.map(genre => (
                      <span key={genre.id} className={styles.genre}>{genre.name}</span>
                    ))}
                  </div>
                  <div className={styles.viewDetails} onClick={handleMovieClick}>Click for more details</div>
                </div>
              </>
            ) : (
              <div className={styles.emptyCard}>
                <div className={styles.emptyCardContent}>
                  <span className={styles.movieIcon}>🎬</span>
                  <p>Press the button above to find your movie for tonight!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsOnTonight;