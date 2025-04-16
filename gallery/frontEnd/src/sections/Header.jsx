import React, { useEffect, useState } from 'react'
import NavListItem from '../components/NavListItem'
import NavListData from '../data/NavListData';
import './header.css'
import SearchBar from '../components/SearchBar'
import UserSettings from '../components/UserSettings';



function Header({ setSearchedMovies }) {
    const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        const position = window.pageYOffset;
        setIsScrolled(position > 100);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    return (
      <header className={isScrolled ? 'scrolled' : ''}>
        <a href="#home" className="logo">
          The Gallery
        </a>
        <ul className="nav">
          {NavListData.map((nav) => (
            <NavListItem key={nav._id} nav={nav} />
          ))}
        </ul>
        {/* Pass the setter function to SearchBar */}
        <SearchBar setSearchedMovies={setSearchedMovies} />
        <UserSettings />
      </header>
    );
  }

export default Header
