import "./AdminLogIn.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { color } from "framer-motion";

const AdminLogIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const otpInputRef = useRef(null);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/admin/login",
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
        "Admin login failed: " +
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
        localStorage.setItem("isAdminLoggedIn", "true");
        onLogin();
        setShowOtpModal(false);
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setIsOtpVerifying(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-header">
        <p>Admin Portal</p>

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

      <div className="admin-login-form">
        <h2>Admin Log In</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
            className="admin-input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            required
            className="admin-input-field"
          />
          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Admin Log In"}
          </button>
          <p className="super-admin-link">
            <span onClick={() => navigate("/super-admin")}>Super Admin</span>
          </p>
        </form>
      </div>

      {showOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-content">
            <h2>Enter OTP</h2>
            <h2 style={{ fontSize: "18px", color: "green" }}>
              We sent OTP to <br /> {email}
            </h2>
            <input
              type="text"
              className="otp-input-field"
              value={otp}
              onChange={handleOtpChange}
              ref={otpInputRef}
              maxLength={6}
            />
            {otpError && <span className="otp-error-message">{otpError}</span>}
            <div className="otp-modal-buttons">
              <button
                className="verify-otp-button"
                placeholder="Enter OTP Here"
                disabled={isOtpVerifying || otp.length !== 6}
                onClick={handleOtpSubmit}
              >
                {isOtpVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="account-link">
        <button className="user-login-buttom" onClick={() => navigate("/")}>
          User Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogIn;
