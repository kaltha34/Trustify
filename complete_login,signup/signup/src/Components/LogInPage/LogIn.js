import "./LogIn.css";
import { FaGoogle, FaApple, FaEnvelope } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios

const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [authToken, setAuthToken] = useState(""); // Store JWT token

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        // Send login request to backend
        const response = await axios.post("http://localhost:5000/api/auth/user/login", { email, password });
  
        if (response.status === 200) {
          // On successful login, store token and show OTP modal
          const token = response.data.token;
  
          localStorage.setItem("authToken", token);
          setAuthToken(token);
          setShowOtpModal(true);
          setOtp("");
          setIsOtpVerified(false);
          setOtpError("");
        }
      } catch (error) {
        alert("Error: " + error.response.data.message);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };
  
  const handleOtpSubmit = async () => {
    try {
      const storedToken = localStorage.getItem("authToken"); // Get token from localStorage
  
      if (!storedToken) {
        setOtpError("Authentication failed. Please log in again.");
        return;
      }
  
      // Send OTP verification request to backend
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { otpInput: otp, token: authToken });
  
      if (response.status === 200) {
        setIsOtpVerified(true);
        navigate("/user-dashboard"); // Navigate only after OTP verification
      }
    } catch (error) {
      setOtpError(error.response.data.message);
      setIsOtpVerified(false);
    }
  };
  

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
    setIsOtpVerified(false);
  };


  return (
    <div className="SignUp-Container">
      <p>Welcome to</p>
      <h1>TRUSTIFY</h1>

      <div className="LogIn-Form">
        <h2>Log In account</h2>
        <form onSubmit={handleLogin}>
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
            Log In
          </button>
        </form>
        <div className="Already-Acc">
          <p>
            Do you have An Account?{" "}
            <span onClick={() => navigate("/signup")}>SignUp</span>
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
      {/* Admin Login Button */}
      <div className="admin-login-container">
        <button className="admin-login-button" onClick={() => navigate("/admin-login")}>
          Admin Login
        </button>
      </div>


      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter OTP</h2>
            <input
              type="text"
              placeholder="-"
              className="otp-input"
              value={otp}
              onChange={handleOtpChange}
            />

            {otpError && (
              <span className="otp-error">
                <br />
                {otpError}
              </span>
            )}

            {isOtpVerified && (
              <span className="otp-verified">
                <br />
                OTP Verified
              </span>
            )}
            <div className="modal-buttons">
              <button
                className="verify-button"
                disabled={otp.length !== 6}
                onClick={handleOtpSubmit}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn; 
