import React from 'react'
import './userSettings.css'

function UserSettings() {
  return (
    <div className ='user' >
      <ion-icon name="person-circle-sharp"></ion-icon>
      <div className="dropdown-content">
        <a href="#home">Profile</a>
        <a href="#home">Settings</a>
        <a href="#">Log Out</a>  {/* Add logout functionality */}
      </div>
    </div>
  )
}

export default UserSettings
