import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function Gallery(props) {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState("");

  const { authenticated } = props;
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(
        localStorage.getItem("my-app-token")
      )}`,
    },
  }
  useEffect(() => {
    if (!authenticated) navigate("/login");
    axios
      .get(`${process.env.REACT_APP_BE_URL}/api/users/gallery`, config)
      .then((res) => {
        setImages(res.data.gallery)})
      .catch((err) => console.log(err));
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault()
    const data = new FormData()

    const files = e.target['images'].files
    
    for (let index = 0; index < files.length; index++) {
        data.append('images',files[index])
        
    }

    axios.post(`${process.env.REACT_APP_BE_URL}/api/users/uploads`, data, config)
    .then(res => setImages(res.data.gallery))
    .catch(err => console.log(err))
  }
  
  return (
    <>
      <h3>My Gallery</h3>
      <form onSubmit={submitHandler}>
        <h3>Upload your images</h3>
        <input
          type="file"
          name="images"
          onChange={(e) => setFiles(e.target.files)}
          multiple
          accept="image/jpg,image/jpeg, image/png, image/gif   "
        />
        <input type='submit' value = 'upload' />
      </form>
      {images.map((img) => (
        <div style={{margin:5, border: '2px green solid'}}>
            <img src={`${process.env.REACT_APP_BE_URL}/images/${img}`} height={200} width={200} />
        </div>
      ))}


    </>
  );
}

export default Gallery;
