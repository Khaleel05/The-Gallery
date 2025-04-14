//this is being repurpose to create a watch list page into the watch list page. 
import React, {useState} from 'react'
import Header from '../sections/Header'

function Rankings() {
    // State to manage searched movies
      const [searchedMovies, setSearchedMovies] = useState([]);
  return (
    <div>
        <Header setSearchedMovies={setSearchedMovies}/>
      
    </div>
  )
}

export default Rankings
