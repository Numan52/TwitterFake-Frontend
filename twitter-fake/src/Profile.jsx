import React from 'react'


import Sidebar from './Sidebar'
import "./sidebar.css"
import ProfileContent from './ProfileContent'
import { useParams } from 'react-router-dom'

const Profile = (props) => {

    return (
        <div className='profile-container'>
            <Sidebar 
                setIsLoggedIn={props.setIsLoggedIn}
                currentUsername={props.currentUsername}
                
            />
            <ProfileContent 
                currentUsername={props.currentUsername}
                currentUserId={props.currentUserId}
                setUsername={props.setUsername}
                currentUserImage={props.currentUserImage}
                setUserImage={props.setUserImage}
            />
        </div>
    )
}

export default Profile
