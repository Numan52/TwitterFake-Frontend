import React from 'react'
import "./home.css"
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom"
import Sidebar from './Sidebar'
import Feed from './Feed'


const Homepage = (props) => {
  return (
    <div className='home-container'> 
      <Sidebar setIsLoggedIn={props.setIsLoggedIn}/>
      <Feed />
          
    </div>
  )
}

export default Homepage
