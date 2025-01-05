import React, { useState } from 'react'
import "./editProfile.css"

const EditProfileModal = ({username, setUsername, onClose}) => {
    const [newUsername, setNewUsername] = useState(username)
    const [image, setImage] = useState(null); 
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("")

    const token = localStorage.getItem("token")

    function handlePicUpload(e) {
        console.log(e)
        const file = e.target.files[0]
        if (file) {
            console.log(e.target.files[0])
            setImage(e.target.files[0])
        }
        
    }


    async function handleSave(e) {
        setErrorMessage("")
        setSuccessMessage("")
        if (newUsername === username && image == null) {
            setSuccessMessage("No changes were made.")
            return
        } else if (!newUsername) {
            setErrorMessage("Username cannot be empty")
            return
        } else {
            setSuccessMessage("Applying changes ...")
        }

        
        const formData = new FormData()
        formData.append("oldUsername", username)
        formData.append("newUsername", newUsername)
        formData.append("image", image)
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/updateUser`, {
                method: "PUT",
                body: formData,
                headers: { 
                  "Authorization": `Bearer ${token}`
                }
              })
            
            if (response.ok) {
                const data = await response.json()
                localStorage.setItem("token", data.jwt)
                setSuccessMessage("Image uploaded successfully!");
                onClose()
            } else {
                const errorData = await response.text();
                setErrorMessage(`Upload failed: ${errorData}`);
                setSuccessMessage("")
                return
            }
        } catch (error) {
            setErrorMessage(`Upload failed: ${error.message}`);
            setSuccessMessage("")
            return
        }
        
        
        setUsername(newUsername)

        
    }

    

  return (
    <div className='edit-modal-overlay'>
        <div className='edit-modal-content'>
        <h2>Edit Profile</h2>
        <div className='modal-group'>
            <label>Edit Username:</label>
            <input 
                type="text" 
                value={newUsername} 
                onChange={(e) => setNewUsername(e.target.value)} 
            />
        </div>

        <div className='modal-group'>
        <label>Edit Profile picture:</label>
            <input 
                type="file" 
                accept='image/*'
                onChange={(e) => handlePicUpload(e)}
            />
        </div>

        <div className='modal-actions'>
            <button onClick={() => handleSave()} className='modal-save-button'>Save</button>
            <button onClick={() => onClose()} className='modal-cancel-button'>Cancel</button>
        </div>


        {errorMessage && <p className='modal-error-msg'>{errorMessage}</p>}
        {successMessage && <p className='modal-success-msg'>{successMessage}</p>}
        </div>
        
    </div>
  )
}

export default EditProfileModal
