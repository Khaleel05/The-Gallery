import React, { useState, useContext } from 'react';
import GenreApiList from '../data/GenreApiList';
import Style from './genreSelection.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to get current user info
import axios from 'axios';

function GenreSelection() {
    const navigate = useNavigate();
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

        // Check if any genres are selected
        if (selectedGenres.length === 0) {
            alert('Please select at least one genre');
            return;
        }

        try {
            // Send selected genres and user ID to backend
            const res = await axios.post("http://localhost:8081/user/genreSelection", {
                userId: currentUser.email,
                selectedGenres: selectedGenres.map(genre => ({
                    id: genre.genreId,
                    name: genre.genreName
                }))
            }, {
                withCredentials: true // Important for sending cookies/session
            });

            // Handle successful response 
            console.log('Genres saved successfully', res.data);
            
            // Add navigation or next step logic here
            navigate('/userMovieSelection')
            // For example: navigate to next page or show success message
            //alert('Genres saved successfully!');

        } catch(error) {
            console.error('Error saving genres:', error);
            alert('Failed to save genres. Please try again.');
        }
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
      <button 
      className={Style.nextButton}
      onClick={handleNext}
      >
        Next
      </button>
    </div>
  )
}

export default GenreSelection
