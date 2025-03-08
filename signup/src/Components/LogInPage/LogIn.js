// export default LogIn;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LogIn.css";

const LogIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [authToken, setAuthToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        // Send login request to backend
        const response = await axios.post(
          "http://localhost:5000/api/auth/user/login",
          { email, password }
        );

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
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { otpInput: otp, token: authToken }
      );

      if (response.status === 200) {
        localStorage.setItem("isUserLoggedIn", "true"); // Store admin login state

        setIsOtpVerified(true);
        navigate("/user-dashboard");
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
    <div className="LogIn-Container">
      <div className="header">
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

      <div className="LogIn-Form">
        <h2>Log In Account</h2>
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
          <span
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
          <button type="submit" className="SignUp-Button">
            Log In
          </button>
        </form>
        <div className="newAcc">
          <p>
            Do you have an Account?{" "}
            <span onClick={() => navigate("/signup")}>SignUp</span>
          </p>
        </div>
      </div>

      <div className="admin-login-container">
        <button
          className="admin-login-button"
          onClick={() => navigate("/admin-login")}
        >
          Admin Login
        </button>
      </div>

      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2
              style={{ fontSize: "38px", color: "blue", fontWeight: "bolder" }}
            >
              TRUSTIFY
            </h2>
            <h2 style={{ fontSize: "18px" }}>We sent OTP to {email}</h2>
            <input
              type="text"
              placeholder="Enter OTP Here"
              className="otp-input"
              value={otp}
              maxLength={6}
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
