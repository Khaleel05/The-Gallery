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
export default SearchBar
