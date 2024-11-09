import React from 'react'


import Sidebar from './Sidebar'
import "./sidebar.css"
import ProfileContent from './ProfileContent'

const Profile = (props) => {
    
    return (
        <div className='profile-container'>
            <Sidebar setIsLoggedIn={props.setIsLoggedIn} />
            <ProfileContent />
        </div>
    )
}

export default Profile
