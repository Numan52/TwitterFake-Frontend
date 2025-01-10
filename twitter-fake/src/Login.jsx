import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./login.css"

const Login = (props) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      props.setIsLoggedIn(true)
    }
  }, [navigate, props])

  async function handleLogin(e) {
    e.preventDefault()
    setErrorMessage("")


    try {

      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({username: username, password: password})
      })
    
      if(response.ok) {
        const data = await response.json()
        console.log(data)
        console.log("login successful") 
        localStorage.setItem("token", data.jwt);
        props.setIsLoggedIn(true)
        navigate("/")
      } else {
        const message = await response.text()
        if (message.toLowerCase().includes("incorrect username or password")) {
          setErrorMessage(message)
          console.log(true)
        } else {
          setErrorMessage("An error ocurred. Please try again later")
        }
        console.log("response: " + message)
      }
  
    } catch (error) {
      console.log("error while logging in: " + error)
      setErrorMessage("An error ocurred. Please try again later")
    }
  }

  return (
    <div className='login-container'>
      
      <form onSubmit={handleLogin}>
        <div className='login-header'>Login</div>
        <input 
          type="text" 
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required  
        />

        <input 
          type="password" 
          placeholder='Password'
          
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required  
        />

        <div className='login-button-container'>
          <button className='login-button' type='submit'>
            Login
          </button>
          <div className='register-message'>Don't have an Account? <Link to="/register">Sign Up</Link></div>
        </div>

      </form>
      <div style={{marginTop:"10px", fontSize:"1.1rem"}}>(Login may take 1-2 minutes for the first time)</div>
      {errorMessage && 
        <div style={{color:"red", marginTop:"15px", fontSize:"20px"}}> 
          {errorMessage}
        </div>
      }
    </div>
  )
}

export default Login
