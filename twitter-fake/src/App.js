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
import NotFound from './NotFound';
import Messages from './Messages';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null)
  const [currentUserImage, setUserImage] = useState(null)
  let [currentUsername, setCurrentUsername] = useState("")
  
  const token = localStorage.getItem("token")
  console.log("app loaded")
  try {
    if(isLoggedIn) {
      currentUsername = getDecodedJwt(token).sub
    } 
  } catch (error) {
      if (error instanceof InvalidTokenError) {
          window.location.reload()
      }
      console.log(error)
  }


  useEffect(() => {
    const loggedUser = localStorage.getItem('token');
    setIsLoggedIn(Boolean(loggedUser));
  }, []);


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
    <>
      {isLoggedIn !== null && 
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
                  currentUsername={currentUsername}
                  userImage={currentUserImage}
                  currentUserId={currentUserId}
                /> 
                : <Navigate replace to="/login"/>
              }
                
          />

          <Route 
            path='/messages/'
            element={
              isLoggedIn ? 
                <Messages 
                  setIsLoggedIn={setIsLoggedIn} 
                  currentUsername={currentUsername}
                  currentUserId={currentUserId}
                /> 
                : <Navigate replace to="/login"/>
              }
                
          />

          <Route 
            path='/messages/:username'
            element={
              isLoggedIn ? 
                <Messages 
                  setIsLoggedIn={setIsLoggedIn} 
                  currentUsername={currentUsername}
                  currentUserId={currentUserId}
                /> 
                : <Navigate replace to="/login"/>
              }
                
          />




          <Route 
            path='/profile/:username'
            element={
              isLoggedIn ? 
              <Profile 
                setIsLoggedIn={setIsLoggedIn}
                currentUsername={currentUsername}
                currentUserId={currentUserId}
                setUsername={setCurrentUsername}
                currentUserImage={currentUserImage}
                setUserImage={setUserImage}
              /> 
              : <Navigate replace to="/login"/>}
          />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    }
    </>
    
      
  
   
  )
}

export default App;
