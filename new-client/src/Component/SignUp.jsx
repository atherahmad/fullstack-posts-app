/** @format */

import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {

  const [errorMessage, setErrorMessage] = useState("")
  const [userImage, setUserImage] = useState('')

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData()

/*     const userProfile = {
      firstName: e.target["firstName"].value,
      lastName: e.target["lastName"].value,
      password: e.target["password"].value,
      confirmPassword: e.target["confirmPassword"].value,
      email: e.target["email"].value,
      address:{
      streetName: e.target["streetName"].value,
      cityName: e.target["cityName"].value,
      postalCode: e.target["postalCode"].value,
      houseNumber: e.target["houseNumber"].value
      }   
    } */

    for(let i = 0; i < e.target.elements.length -1 ; i++)
    {
      if(e.target.elements[i].name === 'avatar')
      formData.append('image', e.target.elements[i].files[0])
      else 
      formData.append(e.target.elements[i].name, e.target.elements[i].value)
    }

    try{
      const response = await axios.post(`${process.env.REACT_APP_BE_URL}/api/users/create-user`, formData)
      e.target.reset()
      navigate("/login")
    }
    catch(err){
      setErrorMessage(err.request.response)
    }
  } 
  return (
    <>
      <h2>Register !</h2>
    
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
        />
        <input  
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
        />

        <input 
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
         
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input    
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
        />
      <input 
          type="text"
          name="streetName"
          placeholder="Street Name"
          required
        />
        <input 
          type="text"
          name="cityName"
          placeholder="City Name"
          required
        />
        <input 
          type="number"
          name="houseNumber"
          placeholder="House No."
          required
        />
        <input 
          type="number"
          name="postalCode"
          placeholder="Post code"
          required
        />
        <input 
          type="file"
          name="avatar"
          onChange={(e)=>setUserImage(e.target.files[0])}
        />
        <input type="submit" value="Register" />
      </form>
      {
        errorMessage 
          && <p style={{color:'red'}}>{errorMessage}</p>          
      }
      <p className="mb-3 text-sm">
        Already have  an account? <br />
        <NavLink to="/login" className="link" >Log in</NavLink>

      </p>
    </>
  );
}
