import React, { useEffect, useRef, useState } from 'react'
import "./feed.css"
import { getDecodedJwt, getUserIdFromUsername, getUserImage } from './userUtil'
import { RotatingLines } from 'react-loader-spinner'
import Hamburger from 'hamburger-react'
import Post from './Post'
import { formatDate, handleLikePost, sendResponse, handleLikeResponse } from './PostUtility'

const Feed = () => {
  const [text, setText] = useState("")
  const [tweets, setTweets] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [respondingTo, setRespondingTo] = useState(null)
  const [responseText, setResponseText] = useState("")
  const [hasMoreTweets, setHasMoreTweets] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [showHamburger, setShowHamburger] = useState(null)
  const [userImage, setUserImage] = useState(null)
  const textareaRef = useRef(null)

  const token = localStorage.getItem("token")
  
 
  useEffect(() => {
    
    const fetchUserId = async () => {
      try {
        const currentUserId = await getUserIdFromUsername(getDecodedJwt(token).sub)
        setCurrentUserId(currentUserId)
        
      } catch (error) {
        console.error("Error fetching user: ", error)
      }
    }

    fetchUserId(); 
  }, [])
  
  

  // console.log(getDecodedJwt(localStorage.getItem("token")).sub)


  useEffect(() => {
    const fetchUserImg = async () => {
      try {
        console.log(currentUserId)
        const imageData = await getUserImage(currentUserId)
        console.log(imageData)
        setUserImage(imageData)
      } catch (error) {
        console.log(error.message)
        console.error("Error fetching user image: ", error)
      }
      
    }
    
     fetchUserImg()
  }, [currentUserId])

  useEffect(() => {
    console.log("Component mounted, fetching tweets...");
    fetchTweets(page)
  }, [])


  useEffect(() => {
    setResponseText("")
  }, [respondingTo])
  
  
  useEffect(() => {
    console.log("tweets changed: ", tweets)
  }, [tweets])




  useEffect(() => {
    console.log("page changed: ", page)
  }, [page])

  const fetchTweets = async (currentPage = page) => {
    if (loading || !hasMoreTweets) return

    setLoading(true)
    
    try {
      console.log(`page before fetching tweet: ${currentPage}`)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getTweets?page=${currentPage}&size=10`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if(data.content.length > 0) {
          setTweets(prevTweets => [...prevTweets, ...data.content])

          if (data.content.length === 10) {
            setPage(oldPage => oldPage + 1) 
          } else {
            setHasMoreTweets(false)
          }

        }
      
      }
    } catch (error) {
        console.log("Error while fetching tweets", error)
    } finally {
      console.log("finally block")
      setTimeout(() => {
        setLoading(false)
      }, 1000)
        
    }

  }

  // TODO: HANDLE JWT EXPIRATION
  

  const postTweet = async () => {
    
    setText("")
    if (!text.trim()) return
    
    const userId = await getUserIdFromUsername(getDecodedJwt(token).sub)

    console.log(userId)
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/postTweet`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
        ,
        body: JSON.stringify({userId: userId, content: text})
      })
      if (response.ok) {
        const newTweet = await response.json()
        setTweets(prevTweets => [newTweet, ...prevTweets])
        console.log("Tweet successfully posted")
      } else {
        throw new Error("Error posting tweet")
      }
    } catch (error) {
      console.error("Error posting tweet: ", error)
    }
    

  }

  


  useEffect(() => {
    const mainTextarea = textareaRef.current
    const responseTextArea = document.querySelectorAll(".user-post-response-input")

    const handleInput = (textarea) => {
      textarea.style.height = 'auto'; // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight - 20}px`; // Set height to the scroll height
    }

    responseTextArea.forEach((textarea) => {
      textarea.addEventListener("input", () => handleInput(textarea))
    })

    mainTextarea.addEventListener("input", () => handleInput(mainTextarea))


    return () => {
      mainTextarea.removeEventListener("input", () => handleInput(mainTextarea))

      responseTextArea.forEach((textarea) => {
        textarea.removeEventListener("input", () => handleInput(textarea))
      })
    }
  }, [respondingTo])


  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 1 || loading) return
      fetchTweets(page)
      
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [page, loading])


  



  


  // TODO: MAKE SIDEBAR RESPONSIVE

  return (
    <div className='feed-container'>
      <div className='feed-post-container'>
        <div className='feed-post-input-container'>
          <img src={userImage == null ? "./user.png" : `data:image/jpg;base64,${userImage}`} alt="" className='feed-post-image'/>
          <textarea 
            ref={textareaRef}
            className='feed-post-textarea' 
            placeholder="What's on your mind?"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
          >
          
          </textarea>
        </div>
        <div className='feed-post-button-container'>
          <button className='feed-post-button' onClick={postTweet}>Post</button>
        </div>
        
      </div>
      <div className='feed-posts-container'>
        
        
        {tweets.length == 0 && !loading &&
          <div className='user-post-error-message'>
            No posts found
          </div>
        }

        {console.log(tweets[0])}
        {tweets.map(tweet => (
        
          <Post
            singlePost={tweets.length === 1}

            key={tweet.id}
            tweet={tweet}
            currentUserId={currentUserId}
            
            formatDate={formatDate}
            handleLikePost={handleLikePost}
            setRespondingTo={setRespondingTo}
            respondingTo={respondingTo}
            sendResponse={sendResponse}
            handleLikeResponse={handleLikeResponse}
            responseText={responseText}
            setResponseText={setResponseText}
            setTweets={setTweets}
          />  
       ))}

      </div>
    
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
    </div>
  )
}

export default Feed
