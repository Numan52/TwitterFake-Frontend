import React, {useEffect, useState} from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import Login from './Login';
import Register from './Register';
import { checkJwtExpired, getDecodedJwt, getUserIdFromUsername, getUserImage } from './userUtil';
import Sidebar from './Sidebar';
import Profile from './Profile';
import { InvalidTokenError } from 'jwt-decode';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null)
  const [userImage, setUserImage] = useState(null)
  let [username, setUsername] = useState("")

  const token = localStorage.getItem("token")

  try {
    if(isLoggedIn) {
      username = getDecodedJwt(token).sub
    } 
  } catch (error) {
      if (error instanceof InvalidTokenError) {
          window.location.reload()
      }
      console.log(error)
  }


  useEffect(() => {
      if(!isLoggedIn) {
        return
      }
      console.log("feed start")
      const fetchUserId = async () => {
        try {
          const currentUserId = await getUserIdFromUsername(getDecodedJwt(token).sub)
          setCurrentUserId(currentUserId)
          
        } catch (error) {
          if (error instanceof InvalidTokenError) {
            window.location.reload()
          }
          console.error("Error fetching user: ", error)
        }
      }
  
      fetchUserId(); 
    }, [isLoggedIn])
    
  
  
  
    useEffect(() => {
      const fetchUserImg = async () => {
        if (currentUserId == null) {
          return
        }
  
        try {
          console.log(currentUserId)
          const imageData = await getUserImage(currentUserId)
          setUserImage(imageData)
        } catch (error) {
          console.log(error.message)
          console.error("Error fetching user image: ", error)
        }
        
      }
      
       fetchUserImg()
    }, [currentUserId])
  
    



  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token || checkJwtExpired(token)) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }, 5000); // Check every 5 seconds
  
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token || checkJwtExpired(token)) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    };
  
    // Initial check
    handleStorageChange();
  
    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


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
            element={
              isLoggedIn ? 
                <Homepage 
                  isLoggedIn={isLoggedIn} 
                  setIsLoggedIn={setIsLoggedIn} 
                  userImage={userImage}
                  currentUserId={currentUserId}
                /> 
                : <Navigate replace to="/login"/>
              }
                
          />

          <Route 
            path='/profile'
            element={
              isLoggedIn ? 
              <Profile 
                setIsLoggedIn={setIsLoggedIn}
                username={username}
                currentUserId={currentUserId}
                setUsername={setUsername}
                userImage={userImage}
                setUserImage={setUserImage}
              /> 
              : <Navigate replace to="/login"/>}
          />

        </Routes>
      </Router>
  
   
  )
}

export default App;
