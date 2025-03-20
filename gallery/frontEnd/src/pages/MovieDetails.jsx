import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../sections/Header'
import Style from './movieDetails.module.css'
import RecMovies from '../API/recMovies'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to get current user info

function MovieDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext); // Get current user from AuthContext

    console.log({id});
  
    // State to hold movie data
    const [movie, setMovie] = useState(null);
    const [streamingService, setStreamingServices] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    // State to manage searched movies
    const [searchedMovies, setSearchedMovies] = useState([]);
  
    // Fetch movie details from your backend
    const getMovieDetails = () => {
      fetch(`http://localhost:8081/api/movies/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setMovie(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    };
  
    // Fetch trailers from your backend
    const getTrailer = () => {
      fetch(`http://localhost:8081/api/movies/${id}/videos`)
        .then((res) => res.json())
        .then((data) => {
          const trailerResults = data.results.find((item) => item.type === 'Trailer');
          setTrailer(trailerResults);
        })
        .catch((error) => console.error('Error:', error));
    };
  
    // Fetch streaming services from your backend
    const getStreamingService = () => {
      fetch(`http://localhost:8081/api/movies/${id}/watch/providers`)
        .then((res) => res.json())
        .then((data) => setStreamingServices(data))
        .catch((error) => console.error('Error:', error));
    };

    // Check if movie is in user's favorites
    const checkFavoriteStatus = () => {
      if (!currentUser) return;
      
      fetch(`http://localhost:8081/api/user/favorites/check/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          setIsFavorite(data.isFavorite);
        })
        .catch(error => {
          console.error('Error checking favorite status:', error);
        });
    };
  
    // Toggle favorite status
    const toggleFavorite = () => {
      if (!currentUser) {
        // Redirect to login if user is not authenticated
        navigate('/login', { state: { from: `/details/${id}` } });
        return;
      }

      setFavoriteLoading(true);
      
      // If it's already a favorite, remove it. Otherwise, add it.
      const endpoint = isFavorite 
        ? `http://localhost:8081/api/user/favorites/remove/${id}`
        : `http://localhost:8081/api/user/favorites/add`;
      
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? null : JSON.stringify({
        movieId: id,
        title: movie.title,
        posterPath: movie.poster_path,
        voteAverage: movie.vote_average
      });

      fetch(endpoint, {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      })
        .then(response => response.json())
        .then(data => {
          setIsFavorite(!isFavorite);
          setFavoriteLoading(false);
        })
        .catch(error => {
          console.error('Error toggling favorite:', error);
          setFavoriteLoading(false);
        });
    };
  
    // Fetch movie details, trailers, and streaming services when the id changes
    useEffect(() => {
      setLoading(true);
      getMovieDetails();
      getStreamingService();
      getTrailer();
      checkFavoriteStatus();
    }, [id, currentUser]);

    // Handle click on a movie card
    const handleClick = (id) => {
        navigate(`/details/${id}`);
    };
  
    // Format date to a more readable format
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
      <div className={Style.detailsContainer}>
        <Header setSearchedMovies={setSearchedMovies}/>
        
        {loading ? (
          <div className={Style.loadingContainer}>
            <div className={Style.loader}></div>
            <p>Loading movie details...</p>
          </div>
        ) : searchedMovies.length > 0 ? (
          <div className={Style.moviegrid}>
            {searchedMovies.map((movie) => (
              <div key={movie.id} className={Style.movieCard}>
                <img
                  className={Style.movieImage}
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  onClick={() => handleClick(movie.id)}
                />
                <p className={Style.movieTitle}>{movie.title}</p>
              </div>
            ))}
          </div>
        ) : movie ? (
          <div className={Style.movieDetailsWrapper}>
            {/* Movie Header Section */}
            <div className={Style.movieHeader}>
              <h1 className={Style.movieTitle}>{movie.title}</h1>
              {movie.tagline && <p className={Style.tagline}>{movie.tagline}</p>}
              <div className={Style.movieMeta}>
                <span className={Style.releaseDate}>{formatDate(movie.release_date)}</span>
                {movie.runtime && <span className={Style.runtime}>{movie.runtime} min</span>}
                {movie.vote_average && (
                  <span className={Style.rating}>
                    <span className={Style.star}>★</span> {movie.vote_average.toFixed(1)}/10
                  </span>
                )}
                
                {/* Favorite Button */}
                <button 
                  className={`${Style.favoriteButton} ${isFavorite ? Style.favorited : ''}`}
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                >
                  {favoriteLoading ? (
                    <span className={Style.favoriteLoader}></span>
                  ) : (
                    <>
                      <span className={Style.heartIcon}>
                        {isFavorite ? '♥' : '♡'}
                      </span>
                      <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Movie Content Section */}
            <div className={Style.movieContent}>
              {/* Left column: Poster */}
              <div className={Style.posterColumn}>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  className={Style.poster} 
                />
                
                {/* Genres under poster */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className={Style.genres}>
                    {movie.genres.map(genre => (
                      <span key={genre.id} className={Style.genre}>{genre.name}</span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Middle column: Video/Trailer */}
              <div className={Style.videoColumn}>
                {trailer ? (
                  <div className={Style.videoWrapper}>
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
                      title="Movie Trailer"
                      className={Style.trailer}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className={Style.noTrailer}>
                    <img 
                      src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
                      alt={movie.title} 
                      className={Style.backdropImage} 
                    />
                    <div className={Style.noTrailerText}>No trailer available</div>
                  </div>
                )}
              </div>
              
              {/* Right column: Overview and other details */}
              <div className={Style.infoColumn}>
                <h2 className={Style.sectionTitle}>Overview</h2>
                <p className={Style.overview}>{movie.overview}</p>
                
                <div className={Style.additionalInfo}>
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className={Style.infoItem}>
                      <h3>Production</h3>
                      <p>{movie.production_companies.map(company => company.name).join(', ')}</p>
                    </div>
                  )}
                  
                  {streamingService && streamingService.results && streamingService.results.US && (
                    <div className={Style.infoItem}>
                      <h3>Where to Watch</h3>
                      <div className={Style.streamingServices}>
                        {streamingService.results.US.flatrate && streamingService.results.US.flatrate.map(provider => (
                          <div key={provider.provider_id} className={Style.provider}>
                            <img 
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                              alt={provider.provider_name} 
                              title={provider.provider_name}
                              className={Style.providerLogo} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recommendations Section */}
            <div className={Style.recommendationsSection}>
              <h2 className={Style.sectionTitle}>You Might Also Like</h2>
              <div className={Style.recMoviesWrapper}>
                <RecMovies />
              </div>
            </div>
          </div>
        ) : (
          <p className={Style.errorMessage}>Unable to load movie details.</p>
        )}
      </div>
    );
}

export default MovieDetails;

