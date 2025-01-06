import React from 'react'
import "./home.css"
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom"
import Sidebar from './Sidebar'
import Feed from './Feed'

// TODO: ABMELDEN FALLS USER NICHT GEFUNDEN
const Homepage = (props) => {
  return (
    <div className='home-container'> 
    
      <Sidebar 
        setIsLoggedIn={props.setIsLoggedIn}
        currentUsername={props.currentUsername}
      />
      <Feed
        userImage={props.userImage}
        currentUserId={props.currentUserId}
      />
          
    </div>
  )
}

export default Homepage
