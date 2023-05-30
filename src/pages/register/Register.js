import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [err, setErr] = useState(null);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleClick = async (event) => {
    console.log(inputs);

    event.preventDefault();
    try {
      let res = await axios.post(
        "http://localhost:8080/api/auth/register",
        inputs
      );
      // Work with the response...
      alert("gui dang ki thanh cong");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onBlur={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onBlur={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onBlur={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onBlur={handleChange}
            />
            {err && window.alert(err)}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
