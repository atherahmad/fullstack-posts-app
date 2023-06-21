import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

function PasswordReset() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("")
  const [message, setMessage] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault()
    try{
        const email = e.target['email'].value
        const response = await axios.post(`${process.env.REACT_APP_BE_URL}/api/auth/password-reset`,{email})
        setMessage(response.data)
    }
    catch(err) {
        setErrorMessage(err.response.data)
    }

  };
  return (
    <>
      <h2>Reset Password</h2>
      <form onSubmit={submitHandler}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="submit" value="Reset" />
        <input
          type="button"
          value="Cancel"
          onClick={() => navigate("/login")}
        />
      </form>

      {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
      {message && <p style={{color:"green"}}>{message}</p>}

    </>
  );
}

export default PasswordReset;
