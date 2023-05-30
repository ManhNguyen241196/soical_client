import React from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
//import icon
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

//auth API content react
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { setCurrentUser } = useContext(AuthContext);
  const darkMode = true;

  const logout = async () => {
    try {
      let res = await axios.get("http://localhost:8080/api/auth/logout", {
        withCredentials: true,
      });
      setCurrentUser("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggle = () => {
    console.log("toggle function");
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>ManhQuyenSocial</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon
          onClick={() => {
            logout();
          }}
        />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img src={`./upload/${currentUser.profilePic}`} alt="" />
          <span>{currentUser.name} </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
