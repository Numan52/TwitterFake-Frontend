import React, { useEffect, useState } from 'react'
import { getDecodedJwt, getUserIdFromUsername } from './userUtil'
import "./profile.css"
import { RotatingLines } from 'react-loader-spinner'
import Post from './Post'
import { formatDate, handleLikePost, sendResponse, handleLikeResponse } from './PostUtility'
import EditProfileModal from './EditProfileModal'
import { InvalidTokenError } from 'jwt-decode'

const ProfileContent = ({username, currentUserId, setUsername, userImage, setUserImage}) => {
    const [activeSection, setActiveSection] = useState("posts")
    const [myPosts, setMyPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [myResponses, setMyResponses] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [showEditModal, setShowEditModal] = useState(false)

    const token = localStorage.getItem("token")
    

    const [respondingTo, setRespondingTo] = useState(null)
    const [responseText, setResponseText] = useState("")
    
    const [hasMoreTweets, setHasMoreTweets] = useState(true)
    const [hasMorelikedTweets, setHasMoreLikedTweets] = useState(true)
    const [hasMoreResponses, setHasMoreResponses] = useState(true)
    
    
    
    
    let tweetsToRender = [];
    let setTweetsFunction = null
    
    if (activeSection === "posts") {
        tweetsToRender = myPosts;
        setTweetsFunction = setMyPosts;
    } else if (activeSection === "responses") {
        tweetsToRender = myResponses;
        setTweetsFunction = setMyResponses;
    } else if (activeSection === "liked") {
        tweetsToRender = likedPosts;
        setTweetsFunction = setLikedPosts;
    }


    useEffect(() => {
        setPage(0)
        setHasMoreTweets(true); // Reset "has more" flags for fresh data loading
        setHasMoreLikedTweets(true);
        setHasMoreResponses(true);

        if (activeSection === "posts") {
            setMyPosts([])
            // getMyPosts()
        }
        if (activeSection === "responses") {
            setMyResponses([])
            // getMyResponses()
        }
        if (activeSection === "liked") {
            setLikedPosts([])
            // getLikedPosts()
        }
    }, [activeSection])

    useEffect(() => {
        // Fetch data only after the page has been reset to 0
        if (page === 0) {
            if (activeSection === "posts") {
                getMyPosts();
            } else if (activeSection === "responses") {
                getMyResponses();
            } else if (activeSection === "liked") {
                getLikedPosts();
            }
        }
    }, [page, activeSection]);


    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 1 || loading) return

            if (activeSection === "posts") {
                getMyPosts()
            }
            if (activeSection === "responses") {
                getMyResponses()
            }
            if (activeSection === "liked") {
                getLikedPosts()
            }}

            window.addEventListener("scroll", handleScroll)
            return () => window.removeEventListener("scroll", handleScroll)
      }, [page, loading])


    async function getMyPosts() {
        console.log(page)
        if (loading || !hasMoreTweets) return
        setLoading(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-posts?username=${username}&page=${page}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data)

                if(data.content.length > 0) {
                    setMyPosts(prevTweets => [...prevTweets, ...data.content])
          
                    if (data.content.length === 10) {
                      setPage(oldPage => oldPage + 1) 
                    } else {
                      setHasMoreTweets(false)
                    }
                }
            }
        } catch (error) {
            console.log("Error getting users posts: ", error)
        } finally {
            setLoading(false)
        }   
    }

    async function getLikedPosts() {
        if (loading || !hasMorelikedTweets) return
        // setpage(0)
        console.log(page)
        setLoading(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/liked-posts?username=${username}&page=${page}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data)

                if(data.content.length > 0) {
                    setLikedPosts(prevTweets => [...prevTweets, ...data.content])
          
                    if (data.content.length === 10) {
                      setPage(oldPage => oldPage + 1) 
                    } else {
                      setHasMoreLikedTweets(false)
                    }
                }
            }
        } catch (error) {
            console.log("Error getting liked posts: ", error)
        } finally {
            setLoading(false)
        }   
    }

    async function getMyResponses() {
        if (loading || !hasMoreResponses) {
            return
        }
        setLoading(true)
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-responses?username=${username}&page=${page}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                
                if(data.content.length > 0) {
                    setMyResponses(prevTweets => [...prevTweets, ...data.content])
          
                    if (data.content.length === 10) {
                      setPage(oldPage => oldPage + 1) 
                    } else {
                      setHasMoreResponses(false)
                    }
                }
            }
        } catch (error) {
            console.log("Error getting user responses: ", error)
        } finally {
            setLoading(false)
        }   
    }


    

    return (
    <div className='profile-content-container'>
        <div className='user-container'>
            <div className='user-info-container'>
                <div className='user-info'>
                    <img src={userImage == null ? "./user.png" : `data:image/jpg;base64,${userImage}`} alt="" />
                    <div className='user-container-username'>{username}</div>
                </div>

                <div className='user-edit-container'>
                    <button className='edit-user-btn' onClick={() => setShowEditModal(true)}>Edit Profile</button>
                </div>
            </div>
            
  
            <div className='profile-container-interactions-selection'> 
                <div className={activeSection === "posts" ? "active-section" : ""} onClick={() => setActiveSection("posts")}>
                    Posts
                </div>

                <div className={activeSection === "responses" ? "active-section" : ""} onClick={() => setActiveSection("responses")}>
                    Responses
                </div>

                <div className={activeSection === "liked" ? "active-section" : ""} onClick={() => setActiveSection("liked")}>
                    Liked Posts
                </div>
            </div>       
        </div>

        <div className='profile-content'>

            {tweetsToRender.length === 0 && !loading &&
                <div className='user-post-error-message'>
                    No posts found
                </div>
            }

            {tweetsToRender.map(tweet => (
                <Post
                    singlePost={tweetsToRender.length === 1} 
                    key={tweet.id}
                    tweet={tweet}
                    formatDate={formatDate}
                    currentUserId={currentUserId}
                    handleLikePost={handleLikePost}
                    setRespondingTo={setRespondingTo}
                    respondingTo={respondingTo}
                    sendResponse={sendResponse}
                    handleLikeResponse={handleLikeResponse}
                    responseText={responseText}
                    setResponseText={setResponseText}
                    setTweets={setTweetsFunction}
                />  
            ))}


            {loading &&
                <div className='feed-loading-info'>
                    <RotatingLines
                        visible={true}
                        height="80"
                        width="80"
                        color="grey"
                        strokeWidth="3"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            }

            {showEditModal && 
                <EditProfileModal 
                    username={username}
                    setUsername={setUsername}
                    setUserImage={setUserImage}
                    onClose={() => setShowEditModal(false)}
                />
            }

        </div>
        
    </div>
    
  )
}

export default ProfileContent
