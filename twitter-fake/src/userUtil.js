import {InvalidTokenError, jwtDecode} from 'jwt-decode';

export function getDecodedJwt(token) {
    if (token == null) {
        throw new InvalidTokenError("Error decoding jwt: No token")
    }
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
    if(response.ok) {
        const data = await response.json()
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
        return data
    } else {
        console.log("failed to fetch user id")
        throw new Error("failed to fetch user id")
    }
}


export async function getUser(userId) {
    const token = getJwt()
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getUser?userId=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if(response.ok) {
        const data = await response.json()
        return data
    } else {
        console.log("failed to fetch user")
        throw new Error("failed to fetch user")
    }
}


export function checkJwtExpired() {
    const token = getJwt()
    let decodedToken = getDecodedJwt(token)

    let currentDate = new Date()
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log("jwt token expired")
        return true
    }
    else {
        return false
    }
}

