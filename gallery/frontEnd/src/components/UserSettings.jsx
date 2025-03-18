import React, { useContext} from 'react'
import './userSettings.css'
import { AuthContext } from '../context/AuthContext';

function UserSettings() {
  const { logout } = useContext(AuthContext); 

  return (
    <div className ='user' >
      <ion-icon name="person-circle-sharp"></ion-icon>
      <div className="dropdown-content">
        <a href="#profile">Profile</a>
        <a href="#home">Settings</a>
        <a href="#">Log Out</a>  {/* Add logout functionality */}
      </div>
    </div>
  )
}

export default UserSettings
