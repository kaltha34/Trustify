import React, { useState, useRef } from "react";
import "./resetpassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [changeTime, setChangeTime] = useState("");

  const otpInputs = useRef([]);

  const handleVerifyEmail = () => {
    if (!email.includes("@")) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError("");
      setIsEmailVerified(true);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError("");

      if (value && index < 5) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp !== "123456") {
      setOtpError("Invalid OTP. Please try again.");
    } else {
      setOtpError("");
      setIsOtpVerified(true);
    }
  };

  const handleResetPassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setChangeTime(new Date().toLocaleString());
    setIsPasswordChanged(true);
  };

  return (
    <div className="container">
      <h1 className="brand-name">
        {"Trustify".split("").map((letter, index) => (
          <span key={index} className="hover-letter">
            {letter}
          </span>
        ))}
      </h1>

      <div className="card">
        <h2 className="heading">Reset Password</h2>

        {!isEmailVerified ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
            <button onClick={handleVerifyEmail} className="button verify-btn">
              Verify Email
            </button>
          </>
        ) : !isOtpVerified ? (
          <>
            <p className="otp-label">Enter OTP sent to your email</p>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  ref={(el) => (otpInputs.current[index] = el)}
                  className="otp-input"
                  required
                />
              ))}
            </div>
            {otpError && <p className="error-message">{otpError}</p>}
            <button onClick={handleVerifyOtp} className="button verify-btn">
              Verify OTP
            </button>
          </>
        ) : !isPasswordChanged ? (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
            <p className="password-hint">
              🔒 Must be 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1
              special character.
            </p>
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button onClick={handleResetPassword} className="button reset-btn">
              Reset Password
            </button>
          </>
        ) : (
          <div className="confirmation-section">
            <h3>Your password has been changed successfully!</h3>
            <p>Time of change: {changeTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
