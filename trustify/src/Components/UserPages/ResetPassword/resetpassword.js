import React, { useState, useRef, useEffect } from "react";
import "./resetpassword.css";
import { Navigate, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [passwordStrength, setPasswordStrength] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // Handle email submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setCurrentStep(2);
      startTimer();
    } else {
      alert("Please enter a valid email address");
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6 && /^\d+$/.test(otpValue)) {
      setCurrentStep(3);
      clearInterval(timerRef.current);
    } else {
      alert("Please enter a valid 6-digit code");
    }
  };

  // Handle password reset submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePassword(newPassword)) {
      if (newPassword === confirmPassword) {
        setCurrentStep(4);
      } else {
        alert("Passwords do not match");
      }
    } else {
      alert("Please ensure your password meets all requirements");
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  // Handle OTP input keydown for backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    checkPasswordStrength(password);
    updatePasswordRequirements(password);
  };

  // Start timer for OTP expiration
  const startTimer = () => {
    setTimer(300); // Reset to 5 minutes
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    startTimer();
    alert("New verification code sent!");
    otpRefs.current[0].focus();
  };

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return Object.values(requirements).every((req) => req === true);
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 3) {
      setPasswordStrength("weak");
    } else if (strength < 5) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  // Update password requirements
  const updatePasswordRequirements = (password) => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="resetPasswordWrapper">
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
                <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
                  4
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
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        className="otpInput"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        ref={(el) => (otpRefs.current[index] = el)}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  <div className="timerContainer">
                    <span>
                      Code expires in:{" "}
                      <span id="timer">{formatTime(timer)}</span>
                    </span>
                  </div>
                  <button type="submit" className="btnPrimary">
                    Verify Code
                  </button>
                  <button
                    type="button"
                    className="btnSecondary"
                    onClick={handleResendOtp}
                  >
                    Resend Code
                  </button>
                </form>
              </section>
            )}

            {/* Reset Password Section */}
            {currentStep === 3 && (
              <section className="section">
                <h3>Create New Password</h3>
                <p>Your password must be at least 8 characters long.</p>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="inputGroup">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <div
                      className={`passwordStrength ${
                        passwordStrength ? passwordStrength : ""
                      }`}
                    ></div>
                  </div>
                  <div className="inputGroup">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="passwordRequirements">
                    <ul>
                      <li className={requirements.length ? "valid" : ""}>
                        At least 8 characters
                      </li>
                      <li className={requirements.uppercase ? "valid" : ""}>
                        At least one uppercase letter
                      </li>
                      <li className={requirements.lowercase ? "valid" : ""}>
                        At least one lowercase letter
                      </li>
                      <li className={requirements.number ? "valid" : ""}>
                        At least one number
                      </li>
                      <li className={requirements.special ? "valid" : ""}>
                        At least one special character
                      </li>
                    </ul>
                  </div>
                  <button type="submit" className="btnPrimary">
                    Reset Password
                  </button>
                </form>
              </section>
            )}

            {/* Success Section */}
            {currentStep === 4 && (
              <section className="section">
                <h3>Success!</h3>
                <p>Your password has been reset.</p>

                <button
                  className="btnPrimary"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
