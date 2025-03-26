// export default LogIn;
import React, { useState, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const otpInputRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/login",
        { email, password }
      );

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("email", email);
        setAuthToken(token);
        setShowOtpModal(true);
        onLogin();
        setOtp("");
        setOtpError("");

        setTimeout(() => otpInputRef.current?.focus(), 100);
      }
    } catch (error) {
      alert(
        "User login failed: " +
          (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits.");
      return;
    }

    setIsOtpVerifying(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",

        {
          otpInput: otp,
          token: authToken,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("isUserLoggedIn", "true");
        onLogin();
        setShowOtpModal(false);
        navigate("/user-dashboard");
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setIsOtpVerifying(false);
    }
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
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </span>
          <button type="submit" className="SignUp-Button">
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="newAcc">
          <p>
            Do you have an Account?{" "}
            <span onClick={() => navigate("/signup")}>SignUp</span>
          </p>
        </div>
      </div>

      <div className="account-link">
        <button
          className="admin-login-buttom"
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
            <h2 style={{ fontSize: "18px", color: "white" }}>
              We sent OTP to {email}
            </h2>
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
                {isOtpVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
