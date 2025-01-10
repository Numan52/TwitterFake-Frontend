import React, { useEffect, useState } from 'react'
import { getUserImage } from './userUtil'
import { Link } from 'react-router-dom'

const Post = ({singlePost, tweet, currentUserId, formatDate, handleLikePost, setRespondingTo, respondingTo, sendResponse, handleLikeResponse, responseText, setResponseText, setTweets}) => {
  const [authorImage, setAuthorImage] = useState(null)
  const [responderImages, setResponderImages] = useState({})

  useEffect(() => {
    const fetchAuthorImg = async (authorId) => {
      try {
        console.log(currentUserId)
        const imageData = await getUserImage(authorId)
        setAuthorImage(imageData)
      } catch (error) {
        console.log(error.message)
        console.error("Error fetching user image: ", error)
      }
    }

    fetchAuthorImg(tweet.authorId)
  }, [currentUserId])


  useEffect(() => {
    const fetchRespondersImages = async (responses) => {
      try {
        for (const response of responses) {
          const imageData = await getUserImage(response.authorId)
          setResponderImages((oldImages) => {
            return {
              ...oldImages,
              [response.id]:imageData
            }
          })
        }
        
        
      } catch (error) {
        console.log(error.message)
        console.error("Error fetching user image: ", error)
      }
    }

    fetchRespondersImages(tweet.responses)
  }, [tweet.responses])
  
  
  

  return (
    <div className={`user-post-container ${!singlePost ? "multiple-posts" : ""}`}  key={tweet.id}>
            <div className='user-post-user-container'>
              {<Link to={`/profile/${tweet.author}`} className='profile-link'> 
              <div className='user-post-user-link'>
                <img src={authorImage == null ? "/user.png" : `data:image/jpg;base64,${authorImage}`} className='post-user-container-image' alt='Profile Picture'/>
                <div className='post-user-container-username'>{tweet.author}</div>
              </div>
              </Link>}
              
              <div className='user-post-createdAt'>{'\u26AC'} {formatDate(tweet.createdAt)}</div>
              {/* <Hamburger toggled={showHamburger === tweet.id} toggle={() => setShowHamburger(showHamburger === tweet.id ? null : tweet.id)}/> */}
            </div>
            <div className='user-post-content-container'>
              {tweet.content}
            </div>
            <div className='user-post-interact-container'>
              <div className='user-post-like-container'>
                <img src={tweet.likedBy.includes(currentUserId) ? "/heart.png" : "/black-heart.png" } className='user-post-heart-img' alt="" 
                  onClick={() => {
                    const unliked = tweet.likedBy.includes(currentUserId)
                    handleLikePost(tweet.id, unliked, setTweets)
                  }} 
                />
                <div>{tweet.likedBy.length}</div>
              </div>

              <div className='user-post-response-button-container'>
                <img src="/respond.png" className='user-post-respond-img' alt="" 
                  onClick={() => setRespondingTo(tweet.id)} 
                />
                <div>{tweet.responses.length}</div>
              </div>
              
            </div>
            {respondingTo == tweet.id && 
              <div className='user-post-response-input-container' >
                <textarea
                  rows={1}
                  className='user-post-response-input' 
                  value={responseText} 
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write a response..."
                >
                </textarea>
                <button
                  className='user-post-send-response-button'
                  onClick={() => sendResponse(currentUserId, responseText, respondingTo, setTweets, setRespondingTo, setResponseText)}
                >
                  Respond
                </button>
              </div>
            }
            {tweet.responses.length !== 0 && <div className='user-post-comments-header'>Comments</div>}
            {tweet.responses.map(response => (
              <div className='user-post-response-container' key={response.id}>
                <div className='user-post-response-container-2'>

                  <div className='user-post-response-user-container'>
                    {<Link to={`/profile/${response.author}`} className='profile-link'> 
                      <div className='user-response-user-link'>
                        <img src={responderImages[response.id] == null ? "/user.png" : `data:image/jpg;base64,${responderImages[response.id]}`} alt="profile-picture" className='post-response-user-container-image' />
                        <div className='post-response-user-container-username'>{response.author}</div>
                      </div>
                    </Link>}
                   
                    <div className='user-response-createdAt'>{'\u26AC'} {formatDate(response.createdAt)}</div>
                  </div>

                  <div className='user-post-response-content'>
                    {response.content}
                  </div>

                  <div className='user-response-interact-container'>
                    <div className='user-post-response-like-container'>
                      <img src={response.likedBy.includes(currentUserId) ? "/heart.png" : "/black-heart.png" } className='user-post-heart-img' alt="" 
                          onClick={() => {
                            const unliked = response.likedBy.includes(currentUserId)
                            handleLikeResponse(response.id, unliked, setTweets)
                          }} 
                        />
                        <div>{response.likedBy.length}</div>
                  </div>
                    
                  </div>
                </div>
                
              </div>
            ))}
            

          </div> 
  )
}

export default Post
