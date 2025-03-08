import "./SignUp.css";
import { FaGoogle, FaApple, FaEnvelope } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!(name && email && password)) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/user/signup",
        {
          name,
          email,
          password,
        }
      );

      console.log("Response:", data);

      setSuccessMessage("Sign Up Successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="SignUp-Container">
      <div className="header-signup">
        <p>Welcome to</p>
        <h1>
          <span>T</span>
          <span>R</span>
          <span>U</span>
          <span>S</span>
          <span>T</span>
          <span>I</span>
          <span>F</span>
          <span>Y</span>
        </h1>
      </div>

      <div className="SignUp-Form">
        <h2>Create an Account</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button type="submit" className="SignUp-Button">
            Sign Up
          </button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="Already-Acc">
          <p>
            Already You have Account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
