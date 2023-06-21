/** @format */

import { Route, Routes } from "react-router-dom";
import "./App.css";

import Posts from "./Component/Posts";
import Login from "./Component/Login";
import NotFound from "./Component/NotFound";
import SignUp from "./Component/SignUp.jsx";
import Home from "./Component/Home";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { useState } from "react";
import CreatePost from "./Component/CreatePost";
import { useEffect } from "react";
import axios from "axios";
import UpdatePost from "./Component/UpdatePost";
import ChangePassword from "./Component/ChangePassword";
import ConfirmEmail from "./Component/ConfirmEmail";
import PasswordReset from "./Component/PasswordReset";
import PasswordRecovery from "./Component/PasswordRecovery";
import Gallery from "./Component/Gallery";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("")

  const logoutHandler = () => {
    setAuthenticated(false);
    setAvatar(false)
    localStorage.removeItem("my-app-token");
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("my-app-token"));

    if (token !== null) {
      axios
        .get(`${process.env.REACT_APP_BE_URL}/api/auth/authorize-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserName(response.data.userName);
          setAuthenticated(true);
          setUserId(response.data.userId);
          setAvatar(response.data.avatar)
        })
        .catch((err) => {
          if(err.response.status === 401)
          localStorage.removeItem("my-app-token");
          console.log(err.message)
        });
    }
  }, []);
  return (
    <>
      <Header
        authenticated={authenticated}
        userName={userName}
        setAuthenticated={setAuthenticated}
        logoutHandler={logoutHandler}
        avatar={avatar}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setAuthenticated={setAuthenticated}
              setUserName={setUserName}
              setUserId={setUserId}
              authenticated={authenticated}
              setAvatar = {setAvatar}
            />
          }
        />
        <Route path="/posts" element={<Posts userId={userId} />} />
        <Route
          path="/create-post"
          element={<CreatePost authenticated={authenticated} />}
        />
        <Route path="/register" element={<SignUp />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/confirm-email/:token"
          element={
            <ConfirmEmail
              setAuthenticated={setAuthenticated}
              setUserName={setUserName}
              setUserId={setUserId}
            />
          }
        />
        <Route path="/my-gallery" element={<Gallery authenticated={authenticated}/>}  />
        <Route path="/password-reset/:email/:token" element={<PasswordRecovery />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
