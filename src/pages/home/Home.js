import React, { useEffect, useState } from "react";
import "./home.scss";
import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [res, setRes] = useState("");
  const navigate = useNavigate();

  const check = async () => {
    try {
      let res = await axios.get("http://localhost:8080/api/auth/login", {
        withCredentials: true,
      });
      setRes(res.data);
    } catch (error) {
      navigate("/login");
    }
  };
  useEffect(() => {
    check();
  }, []);
  return (
    <div className="home">
      {res && (
        <>
          <Stories />
          <Share />
          <Posts />
        </>
      )}
    </div>
  );
};

export default Home;
