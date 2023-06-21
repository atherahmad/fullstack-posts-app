/** @format */

import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Login = (props) => {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate()

  const {setAuthenticated, setUserName, setUserId, authenticated, setAvatar} = props

  useEffect(()=>{
    if(authenticated) navigate("/")
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const userCredential = {
        email: e.target["email"].value,
        password: e.target["password"].value
      }
    const response = await axios.post(`${process.env.REACT_APP_BE_URL}/api/auth/login`,userCredential)
    localStorage.setItem("my-app-token", JSON.stringify(response.data.token))
    e.target.reset()
    setAuthenticated(true)
    setUserName(response.data.userName)
    setUserId(response.data.userId)
    setAvatar(response.data.avatar)
    navigate("/")
    }
    catch(err){
      setShowError(err.response.data)
    }
  };
  return (
    <>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
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

        <input type="submit" value="Submit" />
      </form>

      {
        showError 
          && <p style={{color:'red'}}>{showError}</p>          
      }
      <p className="mb-3 text-sm">
        Have not an account? <br />

        <NavLink to="/register" className="link" > Register</NavLink>

      </p>
      <p style={{color:"yellowgreen"}}>Forgot your password? <NavLink to="/password-reset">Click Here!</NavLink></p>
    </>
  );
};

export default  Login
