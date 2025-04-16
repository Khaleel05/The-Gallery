//this is being repurpose to create a watch list page into the watch list page. 
import React, {useState} from 'react'
import Header from '../sections/Header'
import Style from './rankings.module.css'

function Rankings() {
    // State to manage searched movies
      const [searchedMovies, setSearchedMovies] = useState([]);
  return (
    <div>
      <Header setSearchedMovies={setSearchedMovies}/>
      <div className={Style.container}>
        <h1 className={Style.h1}>This page is not available</h1>
      </div>
      
    </div>
  )
}

export default Rankings
