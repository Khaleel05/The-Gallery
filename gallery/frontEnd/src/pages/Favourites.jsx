import React, { useEffect, useState, useContext } from 'react'
import Header from '../sections/Header'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Style from './recommendations.module.css'; // You'll need to create this CSS module


function Favourites() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchedMovies, setSearchedMovies] = useState([]);

  useEffect(() => {
      // Only fetch recommendations if user is logged in
      if (!currentUser) {
          setLoading(false);
          setError("Please log in to see personalized recommendations");
          return;
      }

      // Fetch personalized recommendations
      const fetchRecommendations = async () => {
          try {
              // You can choose between '/api/recommendations/content-based' or '/api/recommendations/genre-based'
              const response = await fetch('http://localhost:8081/api/recommendations/favourites', {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                  }
              });

              const data = await response.json();
              
              if (response.ok) {
                  setRecommendations(data.recommendations);
              } else {
                  throw new Error(data.error || 'Failed to fetch recommendations');
              }
          } catch (err) {
              console.error('Error fetching recommendations:', err);
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      fetchRecommendations();
  }, [currentUser]);

  // Handle click on a movie card
  const handleClick = (id) => {
      navigate(`/details/${id}`);
  };

  // Main render
  return (
      <div className={Style.pageContainer}>
          <Header setSearchedMovies={setSearchedMovies} />
          
          <div className={Style.contentContainer}>
              {loading ? (
                  <div className={Style.loadingContainer}>
                      <div className={Style.loader}></div>
                      <p>Finding movies you might like...</p>
                  </div>
              ) : error ? (
                  <div className={Style.errorContainer}>
                      <p className={Style.errorMessage}>{error}</p>
                      {!currentUser && (
                          <button 
                              className={Style.loginButton}
                              onClick={() => navigate('/login')}
                          >
                              Login to see recommendations
                          </button>
                      )}
                  </div>
              ) : recommendations.length === 0 ? (
                  <div className={Style.emptyContainer}>
                      <p>We don't have enough information to make recommendations yet.</p>
                      <p>Try adding some movies to your favorites!</p>
                      <button 
                          className={Style.exploreButton}
                          onClick={() => navigate('/movies')}
                      >
                          Explore Movies
                      </button>
                  </div>
              ) : searchedMovies.length > 0 ? (
                  <div className="movie-grid">
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
                  <div className={Style.recommendationsContainer}>
                      <h2 className={Style.title}>Recommended For You</h2>
                      <p className={Style.subtitle}>Based on your favorite movies</p>
                      
                      <div className={Style.movieRow}>
                          {recommendations.map((movie, index) => (
                              <div key={movie.id} className={Style.movieCardRanked}>
                                  <div className={Style.rankBadge}>{index + 1}</div>
                                  <img
                                      className={Style.movieImageExpandable}
                                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                      alt={movie.title}
                                      onClick={() => handleClick(movie.id)}
                                  />
                                  <div className={Style.movieInfo}>
                                      <p className={Style.movieTitle}>{movie.title}</p>
                                      <div className={Style.movieRating}>
                                          <span className={Style.star}>★</span>
                                          <span>{movie.vote_average?.toFixed(1)}</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
}

export default Favourites