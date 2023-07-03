import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import "material-icons/iconfont/material-icons.css";

export default function Upload() {
  const { user, logout } = UserAuth();
  const Navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      Navigate("/");
      console.log("You are logged out");
    } catch (error) {
      console.log(error.message);
    }
  };
  const [active, setActive] = useState(false);
  const showMenu = () => {
    setActive(!active);
  };

  const [files, setfiles] = useState()

  const handleUpload=(e)=>{
    const formData = new FormData()
    const file = e.target.files[0]
    setfiles(file);
    formData.append("file",file)
    console.log(file)    
    try {
      fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
    })
    .then(res => res.json())
    .then(data => console.log(data));
      
    } catch (error) {
      console.log("Internal Server Error occured")
    }
  }

  const handleSubmit = async (e) => {
    try {
      if (!files) {
        console.log("No file found");
      } else {
        const response = await fetch("http://127.0.0.1:5000/convert", {
          method: "GET",
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "audio.mp3";
          link.click();

          URL.revokeObjectURL(url);
        } else {
          console.log("Error occurred during conversion");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Navbar section */}
      <div className="text-white fixed w-full flex justify-between p-4 items-center">
        <div className="text-2xl font-bold text-center">
          <h1 className="text-4xl ">Audify</h1>
        </div>

        <nav>
          <div className="md:hidden scale-125 hover:scale-150">
            <button className="material-icons-outlined" onClick={showMenu}>
              menu
            </button>
          </div>
          <ul className="hidden md:flex gap-8 p-4 uppercase ">
            <li className=" hover:scale-125 hover:underline underline-offset-4  px-4 py-2">
              <Link to="/home">Home</Link>
            </li>
            <li className=" hover:scale-125 hover:underline underline-offset-4  px-4 py-2">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className=" hover:scale-125 hover:underline underline-offset-4  px-4 py-2">
              <Link to="/upload">Upload</Link>
            </li>
            <li className="hover:scale-125 px-4 py-2">
              <button
                onClick={handleLogout}
                className="uppercase hover:underline underline-offset-4  "
              >
                Logout
              </button>
            </li>
          </ul>
          <MenuItems showMenu={showMenu} active={active}></MenuItems>
        </nav>
      </div>
      {/* Buttons for uploading,editing,generating text from audio etc. */}
      <div className="h-screen flex  items-center justify-center gap-10 text-center ">
        <div className="bg-gray-500/30 p-8 rounded-xl mix-blend-luminosity hover:border border-slate-500 border-spacing-2 hover:scale-110 ">
          <h4 className="text-white uppercase text-xl font-bold">Upload</h4>
          <p className="text-white leading-10 my-6 mx-6 text-md font-light opacity-50">
            Upload the video files here
          </p>
          <input
            type="file"
            placeholder="Browse files"
            className="text-center text-sm text-white/50
      file:text-white file:py-2 file:px-4
      file:rounded-full file:border-spacing-2
      file:text-sm file:bg-transparent
      hover:cursor-pointer
     "    
     onChange={handleUpload}
          />
        </div>

        <div className="bg-gray-500/30 p-8 rounded-xl mix-blend-luminosity hover:border border-slate-500 border-spacing-2 hover:scale-110">
          <h4 className="text-white uppercase text-xl font-bold">convert</h4>
          <p className="text-white leading-10 my-6 mx-6 text-md font-light opacity-50">
            Convert video into audio files
          </p>
          <button onClick={handleSubmit} className="bg-transparent border border-spacing-4 text-white hover:bg-white hover:text-black py-2.5 px-8 rounded-full">
            Convert
          </button>
        </div>

        <div className="bg-gray-500/30 p-8 rounded-xl mix-blend-luminosity hover:border border-slate-500 border-spacing-2 hover:scale-110">
          <h4 className="text-white uppercase text-xl font-bold">Edit audio</h4>
          <p className="text-white leading-10 my-6 mx-6 text-md font-light opacity-50">
            Edit your audio files
          </p>
          <button className="bg-transparent border border-spacing-4 text-white hover:bg-white hover:text-black py-2.5 px-8 rounded-full">
            Edit
          </button>
        </div>

        <div className="bg-gray-500/30 p-8 rounded-xl mix-blend-luminosity hover:border border-slate-500 border-spacing-2 hover:scale-110">
          <h4 className="text-white uppercase text-xl font-bold">
            Generate Text
          </h4>
          <p className="text-white leading-10 my-6 mx-6 text-md font-light opacity-50">
            Generate text from audio file
          </p>
          <button className="bg-transparent border border-spacing-4 text-white hover:bg-white hover:text-black py-2.5 px-8 rounded-full">
            Generate
          </button>
        </div>
      </div>

      {/* Logged-in account details */}
      <div className="absolute bottom-0 right-0">
        <p className="text-gray-200/50 ">--Logged in as--</p>
        <p className="text-white  mb-4 mr-4 hover:underline underline-offset-1">
          {user.email}
        </p>
      </div>
    </div>
  );
}
