import "./LogIn.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const AdminLogIn = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("IsuserToken");
    navigate("/login");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [authToken, setAuthToken] = useState(""); 

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/admin/login", { email, password });

        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("authToken", token);
          setAuthToken(token);
          setShowOtpModal(true);
          setOtp("");
          setIsOtpVerified(false);
          setOtpError("");
        }
      } catch (error) {
        alert("Admin login failed: " + error.response.data.message);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
    setIsOtpVerified(false);
  };

  const handleOtpSubmit = async () => {
    try {
      if (!authToken) {
        setOtpError("Authentication failed. Please log in again.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { otpInput: otp, token: authToken });
      
      if (response.status === 200) {
        setIsOtpVerified(true);
        
        navigate("/admin-dashboard");  // Navigate to admin dashboard only after OTP is verified
      }
    } catch (error) {
      setOtpError(error.response.data.message);
      setIsOtpVerified(false);
    }
  };

  return (
    <div className="SignUp-Container">
      <p>Admin Portal</p>
      <h1>TRUSTIFY - Admin</h1>

      <div className="LogIn-Form">
        <h2>Admin Log In</h2>
        <form onSubmit={handleAdminLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin Password" required />
          <button type="submit" className="SignUp-Button">Admin Log In</button>
        </form>
      </div>

      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter OTP</h2>
            <input type="text" className="otp-input" value={otp} onChange={handleOtpChange} />
            {otpError && <span className="otp-error">{otpError}</span>}
            <div className="modal-buttons">
              <button className="verify-button" disabled={otp.length !== 6} onClick={handleOtpSubmit}>Verify</button>
            </div>
          </div>
        </div>
      )}

      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </button>

      <div className="Already-Acc">
        <p>Not an admin? <span onClick={() => navigate("/")}>Go back</span></p>
      </div>
    </div>
  );
};

export default AdminLogIn;
