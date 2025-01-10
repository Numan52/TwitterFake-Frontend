import React, { useEffect, useRef, useState } from 'react'
import "./messages.css"
import { getJwt, getUser } from './userUtil'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatDate } from './PostUtility'

const MessagesContent = ({currentUsername, currentUserId, userId, setUserId, username}) => {
  const [allContacts, setAllContacts] = useState([])
  const [emptyContacts, setEmptyContacts] = useState(null)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [chatContent, setChatContent] = useState(null)
  const [newContact, setNewContact] = useState(null)
  const [inputText, setInputText] = useState("")
  const location = useLocation();

  const textareaRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const navigate = useNavigate()

  const token  = getJwt()

  console.log(selectedChatId)
  console.log("all Contacts: ", allContacts)
  console.log("selected chat id: ", selectedChatId)
  console.log("new contact: ", newContact)
  console.log("chat content: ", chatContent)
  console.log("username: ", username)
  console.log("user id: ", userId)



  useEffect(() => {
    if (location.pathname === "/messages") {
      setAllContacts([]);
      setEmptyContacts(null);
      setSelectedChatId(null);
      setChatContent(null);
      setNewContact(null);
      setUserId(null)
      console.log("/messages")
    }
  }, [location.pathname]);
 

  useEffect(() => {
    async function getAllDialoguePartners() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats/getContacts`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }
        })
  
        if(response.ok) {
            const data = await response.json()
            console.log("data: ", data)
            if (data.length === 0) {
              setEmptyContacts(true)
            } else {
              setEmptyContacts(false)
            }

            setAllContacts(data)
            console.log("Dialogue partners: ", data)
            return data
        } else {
            console.log("failed to fetch contacts")
            setAllContacts([])
        }
      } catch (error) {
        setAllContacts([])
      }

      
    }

    getAllDialoguePartners()
    

    
  }, [token, username])



  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [chatContent?.messages])


  useEffect(() => {
    if (userId === null || username === null || emptyContacts === null) {
      return
    }

    async function selectChat() {
      let existingContact = null

      existingContact = allContacts.find((contact) => contact.username === username)

      if (username) {
        if (existingContact) {
          // select already existing chat
          console.log("existing contact")
          setNewContact(null)
          setSelectedChatId(existingContact.chatId)
          return existingContact.chatId
        } else {
          setSelectedChatId(null)
          const newUser = await createNewContact()
          console.log(newUser)
          
          
          return newUser
        }
  
      }
        
    }

    async function createNewContact() {
      console.log()
      try {
        console.log(userId)
        const user = await getUser(userId)
        
        setAllContacts((oldContacts) => [...oldContacts, user])
        setNewContact(user)
        
        return user
      } catch (error) {
        console.log(error)
      }
      
    }

    selectChat()
    
    

  }, [username, userId, emptyContacts]) 



  useEffect(() => {
    async function getChat() {
      if (selectedChatId === null || !username) {
        setChatContent(null)
        return
      }

      try {
        console.log(selectedChatId)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats/getChat?chatId=${selectedChatId}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }
        })

        if(response.ok) {
            const data = await response.json()
            setChatContent(data)
            console.log("selected chat: ", data)
        } else {
            console.log("failed to fetch chat")
            // handle error
        }
      } catch (error) {
        console.log(error)
      }
    }

    getChat()

  }, [selectedChatId, token])


  useEffect(() => {
      const mainTextarea = textareaRef.current

      if (!mainTextarea) return;

      const handleInput = (textarea) => {
        textarea.style.height = 'auto'; // Reset height to auto
        textarea.style.height = `${textarea.scrollHeight - 20}px`; // Set height to the scroll height
      }
  

      mainTextarea.addEventListener("input", () => handleInput(mainTextarea))
  
  
      return () => {
        mainTextarea.removeEventListener("input", () => handleInput(mainTextarea))
      }
    }, [inputText])


  async function sendMessage() {
    try {
      console.log(selectedChatId)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({chatId: selectedChatId, receiverId: userId, messageContent: inputText})

      })

      if(response.ok) {
          const message = await response.json()
          
          setChatContent((oldContent) => (
            {
              ...(oldContent || {}), // handle if oldContent is null
              messages: [...(oldContent?.messages || []), message]
            }
          ))
          
          setSelectedChatId(message.chatId)
          setNewContact(null)
      } else {
          console.log("failed to send message")
      }

    } catch (error) {
      console.log(error)
    } finally {
      setInputText("")
    }
  }





  return (
    
    <div className='messages-content-container'>
      <div className='messages-contacts-container'>
        {allContacts.map((contact) => (
          
          <div 
            className={`messages-contact-container ${selectedChatId === contact.chatId || newContact?.userId === contact.userId ? "chat-selected" : ""}`}
            onClick={() => {
              setSelectedChatId(contact.chatId)
              navigate(`/messages/${contact.username}`)
            }} 
            key={contact.chatId}
          >
            <Link 
              to={`/profile/${contact.username}`} 
              onClick={(e) => e.stopPropagation()} 
              className='profile-link'
            > 
              <img 
                src={contact.imageData == null ? "/user.png" : `data:image/jpg;base64,${contact.imageData}`} 
                alt="" className='contact-image'
              />
            </Link >
            <div>{contact.username}</div>
          </div>
           
        ))}

        

      </div>

      
      
      <div className='messages-chat-container'>

        {!selectedChatId && newContact && username &&
          <div className='chat-info'>
            You have no chat history with {username}
          </div>
        }

        {!selectedChatId && !newContact &&
          <div className='chat-info'>
            Select a chat
          </div>
        }


        {chatContent &&
          <div className='chat-messages-container' ref={messagesContainerRef}>
          {
              chatContent.messages.map((message) => (
                
                <div className={`chat-message-container ${message.senderId === currentUserId ? "own-message" : "others-message"}`} key={message.messageId}>
                  <div className={`chat-message ${message.senderId === currentUserId ? "own-message" : "others-message"}`}>
                    {message.content}
                  </div>
                  <div className='chat-message-createdAt'>
                    {formatDate(message.createdAt)}
                  </div>
                </div>
            ))}
          </div>
        }
        
          
        

          {(selectedChatId || newContact) && username &&
            <div className='chat-send-message-container'>
                <textarea 
                    ref={textareaRef} 
                    placeholder=""
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                 >

              </textarea>
                <img src="/send.png" alt="" onClick={sendMessage}/>
            </div>
          }

          

          




      </div>

      
    </div>
    
  )
}

export default MessagesContent
