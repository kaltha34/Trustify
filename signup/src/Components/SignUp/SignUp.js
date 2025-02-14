import "./SignUp.css";
import { FaGoogle, FaApple, FaEnvelope } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!(name && email && password && role)) {
      alert("Please fill in all fields.");
    } else {
      setSuccessMessage("SignUp Succefully.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="SignUp-Container">
      <p>Welcome to</p>
      <h1>TRUSTIFY</h1>

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
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
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

      <div className="Options">
        <div className="button">
          <button className="login-button">
            <span className="button-text">Continue with Google</span>
            <FaGoogle size={20} />
          </button>
        </div>
        <div className="button">
          <button className="login-button">
            <span className="button-text">Continue with Apple</span>
            <FaApple size={20} />
          </button>
        </div>
        <div className="button">
          <button className="login-button">
            <span className="button-text">Continue with Email</span>
            <FaEnvelope size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
