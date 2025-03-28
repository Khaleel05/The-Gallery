import React, { useState, useContext } from 'react'
import GenreApiList from '../data/GenreApiList'
import Style from './genreSelection.module.css'
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to get current user info
import axios from 'axios';

function GenreSelection() {
    const [selectedGenres, setSelectedGenres]=useState([]);
    const { currentUser } = useContext(AuthContext); // Get current user from AuthContext
    const _ = require('lodash')

    const handleGenreSelect = (genreId, genreName) => {
        setSelectedGenres(prevSelected => {
            const selectedItem = _.find(prevSelected,{genreId, genreName})
            // If genre is already selected, remove it
            if (_.isEqual(selectedItem, {genreId, genreName})) {
                return prevSelected.filter((item) => item.genreId !== genreId)
            }
            // Otherwise, add the genre
            return [...prevSelected, {genreId, genreName}]
        })
    }
    console.log(currentUser)
    console.log(selectedGenres)

    const handleNext = async(e) =>{
        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:8081/user/genreSelection", {
                
            });
        }catch(error){}
    } 



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
                _.find(selectedGenres,{genreId:genre.id, genreName: genre.name}) ? Style.selectedGenre : ''
            }`}
            onClick={() => handleGenreSelect(genre.id, genre.name)}
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
