import React, { useEffect, useState } from 'react'
import NavListItem from '../components/NavListItem'
import NavListData from '../data/NavListData';
import './header.css'
import SearchBar from '../components/SearchBar'
import UserSettings from '../components/UserSettings';

function Header() {
    //create a useState function that will track 
    const[isScrolled, setIsScrolled] = useState(false);

    useEffect(() =>{
        const handleScroll = () => {
            const position = window.pageYOffset;
            if(position > 100){
                setIsScrolled(true);
            }else{
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll',handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };   
    }, []);

  return (
    <div>
        <header className={isScrolled ? 'scrolled' : ''}>
            <a href="#home" className="logo">
                The Gallery
            </a>
            <ul className="nav">
                {NavListData.map(nav =>(
                    <NavListItem key={nav._id} nav={nav}/>
                ))}
            </ul>
                <SearchBar/>
                <UserSettings/>
        </header>
      
    </div>
  )
}

export default Header
