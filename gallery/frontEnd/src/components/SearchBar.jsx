import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import './searchBar.css'


function SearchBar({ setSearchedMovies }) {
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (input.length > 2) {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/search?query=${input}`,{
            Credentials:'include' 
          });
          setSearchedMovies(response.data.results);
          console.log(setSearchedMovies)
        } catch (error) {
          console.error(error);
        }
      } else {
        setSearchedMovies([]); // Clear results when input is empty
      }
    };

    const timer = setTimeout(fetchData, 500); // Debounce effect

    return () => clearTimeout(timer);
  }, [input, setSearchedMovies]);

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search for movies..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <ion-icon name="search-outline"></ion-icon>
    </div>
  );
}




/*
function SearchBar() {
  //Track the input
  const [input, setInput] = useState('');
  //Track  the list of movies generated
  const [searchedMovies, setSerachedMovies] = useState([]);

  useEffect (() => {
    const fetchData = async () => {
      if(input.length > 2) {
        //Fetch data from the API
        try{
          const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=ac8e81688a0f465351ee8afbfd35c253&query=${input}`);
          setSerachedMovies(response.data.results);
        }
        catch(error){
          console.error(error);
        }
      }
    };
    const timer = setTimeout(() => {
      fetchData();
    }, 500);  // Adding a debounce time of 500ms

    console.log(searchedMovies);

    return () => clearTimeout(timer);  // Clean up the timer
  }, [input]);
  
   
  return (
    <div className='search'>
      <input type='text' placeholder='Search' value={input} onChange={(e)=> setInput(e.target.value)}/>
      <ion-icon name = 'search-outline'></ion-icon>
    </div>
  )
}
  */

export default SearchBar
