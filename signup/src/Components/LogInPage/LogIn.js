import "./LogIn.css";
import { FaGoogle, FaApple, FaEnvelope } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const correctOtp = "123456";

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password && role) {
      setShowOtpModal(true);
      setOtp("");
      setIsOtpVerified(false);
      setOtpError("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
    setIsOtpVerified(false);
  };

  const handleOtpSubmit = () => {
    if (otp === correctOtp) {
      setIsOtpVerified(true);
    } else {
      setIsOtpVerified(false);
      setOtpError("OTP Incorrect");
    }
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
              <button
                className={`continue-button ${
                  isOtpVerified ? "enabled" : "disabled"
                }`}
                disabled={!isOtpVerified}
                onClick={() => setShowOtpModal(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
