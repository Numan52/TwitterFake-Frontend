import React, { useState } from 'react'


import Sidebar from './Sidebar'
import "./sidebar.css"
import ProfileContent from './ProfileContent'
import { useParams } from 'react-router-dom'
import NotFound from './NotFound'

const Profile = (props) => {
    const [userNotFound, setUserNotFound] = useState(false);

    if (userNotFound) {
        return <NotFound />
    }

    return (
        <div className='profile-container'>
            <Sidebar 
                setIsLoggedIn={props.setIsLoggedIn}
                currentUsername={props.currentUsername}
                
            />
            <ProfileContent
                setUserNotFound={setUserNotFound}
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
