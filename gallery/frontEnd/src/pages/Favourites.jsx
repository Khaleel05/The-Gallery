import React, { useEffect, useState, useContext } from 'react'
import Header from '../sections/Header'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Style from './recommendations.module.css'; // You'll need to create this CSS module
import axios from 'axios';
import GenreApiList from '../data/GenreApiList';
import Carousel from '../sections/Carousel'


function Favourites() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [userGenres, setUserGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [genreMap, setGenreMap] = useState([]);
  

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

  // Fetch user's selected genres and movies
  useEffect(() => {
    const fetchUserGenres = async () => {
        try {
            // Fetch user's genres from the backend
            const response = await fetch('http://localhost:8081/user/userMovieSelection', {
                credentials: 'include'
            });

            const genreResponse = await response.json();
            console.log('genreResponse: ',genreResponse);
            const genreList = [];

            for (const genre of genreResponse ){
                console.log(genre.genre_id);
                genreList.push(genre.genre_id);
                console.log('GL:', genreList)
            }
            console.log(genreList)
            setUserGenres(genreList);
            
            if (response.length === 0) {
                console.log(response.data);
                console.log('no data returned!')
                // If no genres found, redirect to genre selection
                //navigate('/home');
                return;
            }

            console.log('UG: ', userGenres)
        } catch (error) {
            console.error('Error fetching user genres:', error);
            //navigate('/home');
            console.log('Error fetching user gneres');
        }
    };

    fetchUserGenres();
  }, []);

  // Map genres from IDs to names when userGenres changes
  useEffect(() => {
    if (userGenres.length > 0) {
      const newGenreMap = [];
      
      for (const genre of userGenres) {
        for (const locatedGenre of GenreApiList) {
          if (genre === locatedGenre.id) {
            newGenreMap.push({id: locatedGenre.id, name: locatedGenre.name});
            break;
          }
        }
      }
      
      setGenreMap(newGenreMap);
      console.log('Updated genre map:', newGenreMap);
    }
  }, [userGenres]);

  // Fetch movies for each genre when genreMap changes
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (genreMap.length === 0) return;
      
      const moviesData = {};

      for (const favGenre of genreMap) {
        try {
          const response = await fetch(`http://localhost:8081/api/movies?genreId=${favGenre.id}`, {
            credentials: 'include'
          });
          
          if (response.status === 401) {
            // Not authenticated redirect to login 
            console.log('api call not authenticated');
            break;
          }
          
          const data = await response.json();
          moviesData[favGenre.id] = data;
        } catch (error) {
          console.error(`Error fetching movies for genre ${favGenre.name}:`, error);
          moviesData[favGenre.id] = [];
        }
      }
      
      setGenreMovies(moviesData);
      console.log('Updated genre movies:', moviesData);
    };

    fetchMoviesByGenre();
  }, [genreMap]);

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
                              onClick={() => navigate('login')}
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
              {/* Genre Based Recommendation */ }
              <div className={Style.genreRecommendationsContainer}>
                {userGenres.length === 0 ? (
                  <div className={Style.emptyContainer}>
                    <p>Favourite genre has not been selected.</p>
                  </div>
                ) : genreMap.length === 0 ? (
                  <div className={Style.loadingContainer}>
                    <div className={Style.loader}></div>
                    <p>Loading genre recommendations...</p>
                  </div>
                ) : (
                  <>
                    <h2 className={Style.title}>Movies from your favourite Genres</h2>
                    {genreMap.map((genre) => (
                      genreMovies[genre.id] && genreMovies[genre.id].length > 0 ? (
                        <Carousel 
                          key={genre.id} 
                          genre={genre.name} 
                          genreId={genre.id}
                          movies={genreMovies[genre.id] || []}
                          handleClick={handleClick}
                        />
                      ) : null
                    ))}
                  </>
                )}
              </div>
          </div>
      </div>
  );
}

export default Favourites