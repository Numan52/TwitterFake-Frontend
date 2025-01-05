import React from 'react'


import Sidebar from './Sidebar'
import "./sidebar.css"
import ProfileContent from './ProfileContent'

const Profile = (props) => {
    
    return (
        <div className='profile-container'>
            <Sidebar setIsLoggedIn={props.setIsLoggedIn} />
            <ProfileContent 
                username={props.username}
                currentUserId={props.currentUserId}
                setUsername={props.setUsername}
                userImage={props.userImage}
                setUserImage={props.setUserImage}
            />
        </div>
    )
}

export default Profile
