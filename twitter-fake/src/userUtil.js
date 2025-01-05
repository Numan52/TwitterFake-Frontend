import {jwtDecode} from 'jwt-decode';

export function getDecodedJwt(token) {
    const decodedToken = jwtDecode(token)
    return decodedToken
}


export function getJwt() {
    return localStorage.getItem("token")
}


export async function getUserImage(userId) {
    const token = getJwt()
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userImage?userId=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    console.log(response)
    if(response.ok) {
        const data = await response.json()
        console.log(`image data: ${data}`)
        return data.imageData
    } else {
        const message = await response.text()
        console.error("failed to fetch image: ", message )
    }
}


export async function getUserIdFromUsername(username) {
    const token = getJwt()
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getUserId?username=${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if(response.ok) {
        const data = await response.json()
        console.log(`data: ${data}`)
        return data
    } else {
        console.log("failed to fetch user id")
    }
}


export function checkJwtExpired() {
    const token = getJwt()
    let decodedToken = getDecodedJwt(token)

    let currentDate = new Date()
    console.log("checkHJwtExpired")
    console.log("jwt expires: ", decodedToken.exp * 1000)
    console.log(currentDate.getTime())
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log("jwt token expired")
        return true
    }
    else {
        return false
    }
}

