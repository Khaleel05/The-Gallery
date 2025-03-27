import React, { useState } from 'react'
import Header from '../sections/Header'
import { useNavigate } from 'react-router-dom';

function Favourites() {
    const navigate = useNavigate();
    const [searchedMovies, setSearchedMovies] = useState([]); 


    const handleClick = (id) => {
        navigate(`/details/${id}`);
        console.log(id);
      };

  return (
    <div>
       <Header setSearchedMovies = {setSearchedMovies}/>
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
        ): (
            <p>not ready</p>
        )}
        </div>
    </div>
  )
}

export default Favourites
