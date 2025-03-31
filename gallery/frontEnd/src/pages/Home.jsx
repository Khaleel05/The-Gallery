import React, {useState, useEffect, useContext} from 'react'
import Header from '../sections/Header'
import './home.css'
import Carousel from '../sections/Carousel'
import Banner from '../sections/Banner'
import GenreApiList from '../data/GenreApiList'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

function Home() {
  const navigate = useNavigate();

  //Access the Auth context.
  const {currentUser, isAuthenticated, loading: authLoading} =useContext(AuthContext);

  // Add console logs to check the values
  console.log('Auth Context in Home:', { currentUser, isAuthenticated, authLoading });


  // State to manage searched movies
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch movies for each genre
    const fetchMoviesByGenre = async () => {
      setLoading(true);
      const moviesData = {};
      
      // Fetch movies for each genre
      for (const genre of GenreApiList) {
        try {
          const response = await fetch(`http://localhost:8081/api/movies?genreId=${genre.id}`,{
            credentials:'include'
        });
        if (response.status === 401){
          //not authenticated redirect to login 
          console.log('api call not authenticated')
          break;
        }
          const data = await response.json();
          moviesData[genre.id] = data;
        } catch (error) {
          console.error(`Error fetching movies for genre ${genre.name}:`, error);
          moviesData[genre.id] = [];
        }
      }
      
      setGenreMovies(moviesData);
      setLoading(false);
    };
    
    fetchMoviesByGenre();
  }, []);

  const handleClick = (id) => {
    navigate(`/details/${id}`);
    console.log(id);
  };

  return (
    <div>
      <Header setSearchedMovies={setSearchedMovies} />
      <div id="Pbody">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading movies...</p>
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
          <>
            <Banner />
            {GenreApiList.map((genre) => (
              <Carousel 
              key={genre.id} 
              genre={genre.name} 
              genreId={genre.id}
              movies={genreMovies[genre.id]||[]}
              handleClick={handleClick}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}


export default Home