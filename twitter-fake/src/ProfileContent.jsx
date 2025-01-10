import React, { useEffect, useState } from 'react'
import { getDecodedJwt, getUserIdFromUsername, getUserImage } from './userUtil'
import "./profile.css"
import { RotatingLines } from 'react-loader-spinner'
import Post from './Post'
import { formatDate, handleLikePost, sendResponse, handleLikeResponse } from './PostUtility'
import EditProfileModal from './EditProfileModal'
import { InvalidTokenError } from 'jwt-decode'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NotFound from './NotFound'

const ProfileContent = ({setUserNotFound, currentUsername, currentUserId, setUsername, currentUserImage, setCurrentUserImage}) => {
const {username} = useParams()

    const [activeSection, setActiveSection] = useState("posts")
    const [myPosts, setMyPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [myResponses, setMyResponses] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [showEditModal, setShowEditModal] = useState(false)
    const [userId, setUserId] = useState(null)
    const [userImage, setUserImage] = useState(null)
    

    const token = localStorage.getItem("token")
    

    const [respondingTo, setRespondingTo] = useState(null)
    const [responseText, setResponseText] = useState("")
    
    const [hasMoreTweets, setHasMoreTweets] = useState(true)
    const [hasMorelikedTweets, setHasMoreLikedTweets] = useState(true)
    const [hasMoreResponses, setHasMoreResponses] = useState(true)
    

    
    useEffect(() => {
        const fetchUserId = async () => {
         
          try {
            const fetchedUserId = await getUserIdFromUsername(username)
            
            
            if (fetchedUserId === currentUserId) {
                setUserId(currentUserId)
                setUserImage(currentUserImage)
            } else {
                setUserId(fetchedUserId)
            }

          } catch (error) {
            console.error("Error fetching user id: ", error)
            setUserNotFound(true)
          }
        }
        
        fetchUserId()
      }, [username, currentUserId, currentUserImage])


    useEffect(() => {
          const fetchUserImg = async () => {
            if (userId == null) {
              return
            }

            if (userId === currentUserId) {
                return
            }
      
            try {
              const imageData = await getUserImage(userId)
              console.log(imageData)
              setUserImage(imageData)
            } catch (error) {
              console.log(error.message)
              console.error("Error fetching user image: ", error)
            }
            
          }
          
           fetchUserImg()
    }, [userId, currentUserId])
    
    
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
        window.scrollTo(0, 0)
    }, [username])


    useEffect(() => {
        console.log("setpage")
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
    }, [activeSection, username])

    useEffect(() => {
        // Fetch data only after the page has been reset to 0
        console.log("fetch posts")
        if (page === 0) {
            if (activeSection === "posts") {
                getMyPosts();
            } else if (activeSection === "responses") {
                getMyResponses();
            } else if (activeSection === "liked") {
                getLikedPosts();
            }
        }
    }, [page, activeSection, username]);


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
                    <img src={userImage == null ? "/user.png" : `data:image/jpg;base64,${userImage}`} alt="" />
                    <div className='user-container-username'>{username}</div>
                </div>

                { currentUsername === username && 
                    <div className='user-edit-container'>
                        <button className='edit-user-btn' onClick={() => setShowEditModal(true)}>Edit Profile</button>
                    </div>
                }
                {currentUsername !== username &&
                    <div className='user-interactions-container'>
                        <div className='user-interactions-msg-container' >
                            <Link 
                                to={`/messages/${username}`}
                            >
                                <img src='/chat.png' className='user-send-message-img' alt='send message'></img>
                            </Link> 
                    
                            <span>Message</span>
                        </div>
                        
                    </div>
                }
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

            {showEditModal && currentUsername === username &&
                <EditProfileModal 
                    username={username}
                    setUsername={setUsername}
                    setUserImage={setCurrentUserImage}
                    onClose={() => setShowEditModal(false)}
                />
            }



        </div>
        
    </div>
    
  )
}

export default ProfileContent
