import React, {useState} from 'react'
import Header from '../sections/Header'
import './home.css'
import Carousel from '../sections/Carousel'
import Banner from '../sections/Banner'
import GenreApiList from '../data/GenreApiList'
import { useNavigate } from 'react-router-dom';





function Home() {
  const navigate = useNavigate();
  // State to manage searched movies
  const [searchedMovies, setSearchedMovies] = useState([]);

  const handleClick = (id) => {
    navigate(`/details/${id}`);
    console.log(id);
  };

  return (
    <div>
      <Header setSearchedMovies={setSearchedMovies} />
      <div id="Pbody">
        {searchedMovies.length > 0 ? (
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
              <Carousel key={genre.id} genre={genre.name}/>
            ))}
            <Carousel />
            <Carousel />
          </>
        )}
      </div>
    </div>
  );
}


/*
function Home() {
  return (
    <div>
      <Header/>
      
      <div id='Pbody'>
        <Banner/>
        <Carousel/>
        <Carousel/>
      </div>
    </div>
  )
}
*/

export default Home
