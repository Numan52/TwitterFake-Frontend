import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import MessagesContent from './MessagesContent'
import "./sidebar.css"
import "./messages.css"
import { useNavigate, useParams } from 'react-router-dom'
import { getUserIdFromUsername } from './userUtil'

const Messages = (props) => {
  const {username} = useParams()
  const navigate = useNavigate()
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    async function getUserId() {
      try {
        console.log(username)
        const fetchedUserId =  await getUserIdFromUsername(username)
        
        console.log(fetchedUserId)
        setUserId(fetchedUserId)
        
      } catch (error) {
        navigate("/messages")
      }
    }

    if (username) {
      getUserId()
    }
    
    
  }, [navigate, username])
  

  
  
  return (
    <div className='messages-container'>

      <Sidebar 
        setIsLoggedIn={props.setIsLoggedIn}
        currentUsername={props.currentUsername}
                
    />

    <MessagesContent 
        currentUsername={props.currentUsername}
        currentUserId={props.currentUserId}
        userId={userId}
        setUserId={setUserId}
        username={username}
    />

    </div>
  )
}

export default Messages
