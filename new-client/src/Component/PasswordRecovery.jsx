import React,  {useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios"
function PasswordRecovery() {

    const {token, email} = useParams()
    const [errorMessage, setErrorMessage] = useState("")
    const [message, setMessage] = useState("")


    const submitHandler = async (e) => {
        e.preventDefault()
        const password = e.target["password"].value
        const confirmPassword = e.target["confirmPassword"].value

        if(password !== confirmPassword) return setErrorMessage("Password and Confirm Password don't match!")

        try{
            const configuration = {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            }
            const response = await axios
                            .put(`${process.env.REACT_APP_BE_URL}/api/auth/password-reset`, {password, confirmPassword, email},configuration)
            setMessage(response.data)
        }
        catch(err){
            setErrorMessage(err.response.data)
        }

    }
  return (
    <>
      <h2>Password Recovery</h2>
      <form onSubmit={submitHandler}>
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
        <input type="submit" value="Reset Password" />
        <input type="reset" value="Reset" />
      </form>

      {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
      {message && <p style={{color:"green"}}>{message}</p>}

    </>
  );
}

export default PasswordRecovery;
