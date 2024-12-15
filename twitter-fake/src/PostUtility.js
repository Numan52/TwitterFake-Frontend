

export async function handleLikePost(tweetId, unliked, setTweets) {
    const token = localStorage.getItem("token");
    try {
        let url = ""
        if (unliked) {
            url = `${process.env.REACT_APP_API_URL}/api/unlikeTweet?postId=${tweetId}`
        } else {
            url = `${process.env.REACT_APP_API_URL}/api/likeTweet?postId=${tweetId}`
        }

        const response = await fetch(url, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        ,
        })
        if (response.ok) {
            const updatedTweet = await response.json()
            setTweets(prevTweets => prevTweets.map((tweet => (
                tweet.id === tweetId 
                ? {...tweet, ...updatedTweet}
                : tweet
            ))))
            console.log("Tweet successfully liked")
        } else {
        throw new Error("Error liking tweet")
        }
    } catch (error) {
        console.error("Error liking tweet: ", error)
    }
}


export async function handleLikeResponse(tweetId, unliked, setTweets) {
    const token = localStorage.getItem("token");
    try {

      let url = ""
      if (unliked) {
        url = `${process.env.REACT_APP_API_URL}/api/unlikeTweet?postId=${tweetId}`
      } else {
        url = `${process.env.REACT_APP_API_URL}/api/likeTweet?postId=${tweetId}`
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
        ,
      })
      if (response.ok) {
        const updatedResponse = await response.json()
        setTweets(prevTweets => prevTweets.map((tweet => (
          tweet.responses.find(response => response.id === tweetId) 
            ? {
                ...tweet, 
                responses: tweet.responses.map(response => response.id === tweetId
                  ? {...response, ...updatedResponse}
                  : response
                )}
            : tweet
        ))))

        console.log("Tweet successfully liked")
      } else {
        throw new Error("Error liking tweet")
      }
    } catch (error) {
      console.error("Error liking tweet: ", error)
    }
  }


export async function sendResponse(currentUserId, responseText, respondingTo, setTweets, setRespondingTo, setResponseText) {
    setRespondingTo(null)
    setResponseText("")
    const token = localStorage.getItem("token");

    if (!responseText.trim()) return;
    
    console.log(currentUserId)
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/postTweet`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
        ,
        body: JSON.stringify({userId: currentUserId, content: responseText, parentPostId: respondingTo})
      })
      if (response.ok) {
        const newResponse = await response.json()
        setTweets(prevTweets => 
          prevTweets.map(tweet => (
            tweet.id === respondingTo 
              ? { ...tweet, responses: [newResponse, ...tweet.responses]} 
              : tweet
          ))
        )
        console.log("response successfully posted")
      } else {
        throw new Error("Error posting response")
      }
    } catch (error) {
      console.error("Error posting response: ", error)
    }
    
  }


export function formatDate(dateString) {
    const postedDate = new Date(dateString)
    const now = new Date()


    const postedToday = postedDate.getDate() === now.getDate() && 
                        postedDate.getMonth() === now.getMonth() &&
                        postedDate.getFullYear === now.getFullYear

    if(postedToday) {
        return `Today at ${postedDate.toLocaleTimeString("en-de", {hour: "numeric", minute: 'numeric'})}`
    } else {
        const options = { weekday: "long", year: "numeric", month: "short", day:"numeric", hour: "numeric", minute: "numeric"}

        return new Date(dateString).toLocaleDateString("en-de", options)
    }
}
