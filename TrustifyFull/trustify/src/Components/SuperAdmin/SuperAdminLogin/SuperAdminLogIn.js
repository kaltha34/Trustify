import "./SuperAdminLogIn.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SuperAdminLogIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const otpInputRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("superAdminToken");
    if (storedToken) {
      navigate("/super-admin-dashboard");
    }
  }, [navigate]);

  const handleSuperAdminLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login-super-admin",
        { email, password }
      );

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("superAdminToken", token);
        setAuthToken(token);
        setShowOtpModal(true);
        setOtp("");
        setOtpError("");

        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      alert(
        "Super Admin login failed: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
    setIsLoading(false);
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
        "http://localhost:5000/api/verify-otp-super-admin",
        { otpInput: otp, token: authToken }
      );

      if (response.status === 200) {
        localStorage.setItem("isSuperAdminLoggedIn", "true");
        onLogin();
        setShowOtpModal(false);
        navigate("/super-admin-dashboard");
      }
    } catch (error) {
      console.log(error);
      setOtpError(error.response?.data?.message || "Invalid OTP. Try again.");
    }
    setIsOtpVerifying(false);
  };

  return (
    <div className="SuperAdmin-Container">
      <div className="SuperAdmin-header">
        <p>Super Admin Portal</p>
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

      <div className="SuperAdminLogIn-Form">
        <h2>Super Admin Log In</h2>
        <form onSubmit={handleSuperAdminLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Super Admin Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Super Admin Password"
            required
          />
          <button
            type="submit"
            className="Superadmin-login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Super Admin Log In"}
          </button>
        </form>
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

      <div className="superaccount-link">
        <button
          className="superadmin-login-buttom"
          onClick={() => navigate("/admin-login")}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default SuperAdminLogIn;
