import React from 'react'
import NavListItem from '../components/NavListItem'
import NavListData from '../data/NavListData';
import './header.css'
import SearchBar from '../components/SearchBar'
import UserSettings from '../components/UserSettings';

function Header() {
  return (
    <div>
        <header>
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
