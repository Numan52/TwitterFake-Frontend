import React, {useEffect, useState} from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import Login from './Login';
import Register from './Register';
import { checkJwtExpired } from './userUtil';
import Sidebar from './Sidebar';
import Profile from './Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 

  useEffect(() => {
    console.log("app useEffect")
    if (localStorage.getItem("token")) {
      if (checkJwtExpired()) {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
      }
    }
  }, [])

  return (
   
      <Router>
        <Routes>
          <Route
            path='/login'
            element={isLoggedIn ? <Navigate replace to="/"/> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route
            path='/register'
            element={isLoggedIn ? <Navigate replace to="/"/> : <Register/>}
          />
          
          <Route 
            path='/'
            element={isLoggedIn ? <Homepage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate replace to="/login"/>}
          />

          <Route 
            path='/profile'
            element={isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} /> : <Navigate replace to="/login"/>}
          />

        </Routes>
      </Router>
  
   
  )
}

export default App;
