import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import "./register.css"

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [secondPassword, setSecondPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setErrorMessage("")

    if (password !== secondPassword) {
      setErrorMessage("The two passwords don't match")
      return;
    }


    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username: username, password: password})
      })

      if(response.ok) {
        console.log("registration successful")
        navigate("/login")
      } else {
        const errorMessage = await response.text()
        setErrorMessage(errorMessage)
        console.log("response: " + errorMessage)
      }
  
    } catch (error) {
      setErrorMessage("An error ocurred. Pls try again later.")
      console.log("error while registering: " + error)
    }
  }

  return (
    <div className='register-container'>
      
      <form onSubmit={handleRegister}>
        <div className='register-header'>Register</div>
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

        <input 
          type="password" 
          placeholder='Confirm your Password'
          value={secondPassword}
          onChange={(e) => setSecondPassword(e.target.value)}
          required  
        />
        
        <div className='register-button-container'>
          <button className='register-button' type='submit'>
            Register
          </button>
          <div className='login-message'>Already have an Account? <Link to="/login">Sign In</Link></div>
        </div>

      </form>
      <div style={{marginTop:"10px", fontSize:"1.1rem"}}>(Registering may take 1-2 minutes for the first time)</div>

      {errorMessage && 
        <div style={{color:"red", marginTop:"15px"}}> 
          {errorMessage}
        </div>
      }
    </div>
  )
}

export default Register