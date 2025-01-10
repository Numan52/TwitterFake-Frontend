import React from 'react'
import "./sidebar.css"
import { useNavigate, Link } from 'react-router-dom'

const Sidebar = (props) => {
  const navigate = useNavigate()

  function handeLogout() {
    localStorage.removeItem("token")
    props.setIsLoggedIn(false)
    navigate("/login")
  }

  return (
    <div className='sidebar-container'>
      
      <Link to="/" className='sidebar-home-link'>
        <div className='sidebar-home'>
          <img src="/home-logo.png" alt="" />
          <div>Home</div>
        </div>
      </Link>
        
      <Link to={`/profile/${props.currentUsername}`} className='sidebar-profile-link'>
        <div className='sidebar-profile'>
          <img src="/user.png" alt="" />
          <div>Profile</div>   
        </div>
      </Link>

      <Link to={`/messages`} className='sidebar-messages-link'>
        <div className='sidebar-messages'>
          <img src="/chat.png" alt="" />
          <div>Messages</div>   
        </div>
      </Link>
      

      <button className='logout-button' onClick={handeLogout}>
        Logout
      </button>
    </div>
  )
}

export default Sidebar
