import axios from 'axios'
import React from 'react'
import { useState } from 'react'

function ChangePassword() {
    
    const [errorMessage, setErrorMessage] = useState("")
    const [responseMessage, setResponseMessage] = useState("")


    const submitHandler = async (e) =>{
        e.preventDefault()
        const userData = {
            currentPassword : e.target["currentPassword"].value,
            newPassword : e.target["newPassword"].value,
            confirmPassword : e.target["confirmPassword"].value,
        }

        if(userData.newPassword !== userData.confirmPassword) return setErrorMessage("New Password and confirm password must be same")
        
        const configuration = {
            headers:{
                'Authorization' : `Bearer ${JSON.parse(localStorage.getItem('my-app-token'))}` 
            }
        }
        try{
            const result = await axios.put(`${process.env.REACT_APP_BE_URL}/api/auth/change-password`, userData, configuration)
            setResponseMessage(result.data)
        }
        catch(err){
            setErrorMessage(err.message)
        }

    }
    return (
        <div>
            <h3>
                Change Password
            </h3>
        <form onSubmit={submitHandler}>
        <input 
         type="password"
         name="currentPassword"
         placeholder="Please enter your current password"
         required
       />
       <input
         type="password"
         name="newPassword"
         placeholder="Please enter new Password"
         required
       />
       <input
         type="password"
         name="confirmPassword"
         placeholder="Please confirm new Password"
         required
       />
        <input type="submit" value="Change Password" />
        <input type="reset" value="Cancel" />

        {errorMessage && <p style={{color:'red'}}>{errorMessage}</p>}
        {responseMessage && <p style={{color:'green'}}>{responseMessage}</p>}

        </form>
         </div>
    )

}

export default ChangePassword
