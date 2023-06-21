import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'

function ConfirmEmail(props) {

    const {token} = useParams()

    const {setAuthenticated, setUserName, setUserId} = props
    
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // Using useEffect hook to make a request to backend to verify the user's token

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_BE_URL}/api/auth/confirm-email/${token}`)
        .then(res=>{
            setMessage(res.data)}
            )
        .catch(err => setErrorMessage(err.message))
    }, [])
    return (
        <div>
             {message && <h2> Your Account has been verified</h2>}
             {errorMessage && <h2 style={{color:"red"}}>{errorMessage}</h2>}
        </div>
    )
}

export default ConfirmEmail
