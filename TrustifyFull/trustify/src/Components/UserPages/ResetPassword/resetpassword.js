import React, { useState, useRef, useEffect } from "react";
import "./resetpassword.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const otpRef = useRef(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setCurrentStep(2);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error sending OTP");
      }
    } else {
      alert("Please enter a valid email address");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/verify-otp-reset",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otpInput: otp }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setCurrentStep(3);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error verifying OTP");
      }
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              newPassword: newPassword,
              confirmPassword: confirmPassword,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Password reset successfully");
          navigate("/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error resetting password");
      }
    } else {
      alert("Passwords do not match");
    }
  };

  const handleOtpChange = (e) => {
    if (/^\d{0,6}$/.test(e.target.value)) {
      // Allow up to 6 digits
      setOtp(e.target.value);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="resetPasswordWrapper">
      <div className="header">
        <p>Reset Password Section</p>
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
      <div className="container">
        <div className="card">
          <div className="cardHeader">
            <h2>Reset Password</h2>
            <div className="progressContainer">
              <div
                className="progressBar"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
              <div className="progressSteps">
                <div
                  className={`step ${currentStep >= 1 ? "active" : ""} ${
                    currentStep > 1 ? "complete" : ""
                  }`}
                >
                  1
                </div>
                <div
                  className={`step ${currentStep >= 2 ? "active" : ""} ${
                    currentStep > 2 ? "complete" : ""
                  }`}
                >
                  2
                </div>
                <div
                  className={`step ${currentStep >= 3 ? "active" : ""} ${
                    currentStep > 3 ? "complete" : ""
                  }`}
                >
                  3
                </div>
              </div>
            </div>
          </div>

          <div className="cardBody">
            {/* Email Section */}
            {currentStep === 1 && (
              <section className="section">
                <h3>Enter your email</h3>
                <p>We'll send a verification code to your email.</p>
                <form onSubmit={handleEmailSubmit}>
                  <div className="inputGroup">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btnPrimary">
                    Send Verification Code
                  </button>
                </form>
              </section>
            )}

            {/* OTP Section */}
            {currentStep === 2 && (
              <section className="section">
                <h3>Verify OTP</h3>
                <p>Enter the verification code sent to your email.</p>
                <form onSubmit={handleOtpSubmit}>
                  <div className="otpContainer">
                    <input
                      type="text"
                      className="otpInput"
                      maxLength="6"
                      value={otp}
                      onChange={handleOtpChange}
                      ref={otpRef}
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="btnPrimary">
                    Verify Code
                  </button>
                </form>
              </section>
            )}

            {/* Reset Password Section */}
            {currentStep === 3 && (
              <section className="section">
                <h3>Set a New Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="inputGroup">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter a new password"
                      required
                    />
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  <button type="submit" className="btnPrimary">
                    Reset Password
                  </button>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
