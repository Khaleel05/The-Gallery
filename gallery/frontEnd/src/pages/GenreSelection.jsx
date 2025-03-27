import React, { useState, useContext } from 'react'
import GenreApiList from '../data/GenreApiList'
import Style from './genreSelection.module.css'
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to get current user info

function GenreSelection() {
    const [selectedGenres, setSelectedGenres]=useState([]);
    const { currentUser } = useContext(AuthContext); // Get current user from AuthContext

    const handleGenreSelect = (genreId) => {
        setSelectedGenres(prevSelected => {
            // If genre is already selected, remove it
            if (prevSelected.includes(genreId)) {
                return prevSelected.filter(id => id !== genreId)
            }
            // Otherwise, add the genre
            return [...prevSelected, genreId]
        })
    }
    console.log(currentUser)
    console.log(selectedGenres)



  return (
    <div className={Style.genreContainer}>
      <div className={Style.heading}>
        <h1>Select Your Favorite Genre</h1>
      </div>
      <div className={Style.genreButtonContainer}>
        {GenreApiList.map((genre) => (
          <button 
            key={genre.id} 
            className={`${Style.genreButton} ${
                selectedGenres.includes(genre.id) ? Style.selectedGenre : ''
            }`}
            onClick={() => handleGenreSelect(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <button className={Style.nextButton}>Next</button>
    </div>
  )
}

export default GenreSelection
