import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Facebook, Linkedin, Instagram, Mail, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserShield, FaExclamationTriangle } from "react-icons/fa";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import io from "socket.io-client";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [counts, setCounts] = useState({
    active: 0,
    inactive: 0,
    inprogress: 0,
  });

  const [active] = useState("12");
  const [inactive] = useState("17");
  const [inprogress] = useState("24");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("IsuserToken");
    navigate("/login");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCounts({ active, inactive, inprogress });
    }, 500);
    return () => clearTimeout(timeout);
  }, [active, inactive, inprogress]);

  const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/notifications")
      .then((response) => response.json())
      .then((data) => {
        setNotifications(data.slice(0, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
    // Listen for socket connection
    socket.on("connect", () => {
      console.log("✅ Socket.io Connected:", socket.id);
    });

    // Listen for new notifications from server
    socket.on("newNotification", (newNotification) => {
      console.log("📩 New notification received:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.io Disconnected");
    });

    return () => {
      socket.off("newNotification");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="Dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
      <div className="Dashboard-body">
        {/* Identity Verification Section */}
        <div className="Verifications">
          <div className="Verification-content">
            <FaUserShield className="image" size={90} color="blue" />
            <h1>Let's Verify Your Identity in 3 minutes</h1>
            <p>
              Verification of your identity is necessary to finalize your
              application for Trustify.
            </p>
            <Link to="/upload">
              <button className="verify-button">Start Verify</button>
            </Link>
            <div className="paragraph">
              <h4>Why do I need to verify my identity?</h4>
            </div>
          </div>
        </div>

        {/* Verification Status Section */}
        <div className="Verifications">
          <div className="Verification-content">
            <h2>Verifications</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <div className="status">
              <span className="dots active"></span>
              <p>Active : {active}</p>
            </div>
            <div className="status">
              <span className="dots inactive"></span>
              <p>Inactive : {inactive}</p>
            </div>
            <div className="status">
              <span className="dots in-progress"></span>
              <p>In Progress : {inprogress}</p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="Verifications">
          <div className="Verification-content">
            <h2>Notifications</h2>
            <div className="Notification-Center">
              {loading ? (
                <p>Loading notifications...</p>
              ) : notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index} className="notification-item">
                      <Mail className="notification-icon" />
                      <p className="notify">{notification.message}</p>
                      <span className="notification-date">
                        {notification.date}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  {" "}
                  <FaExclamationTriangle className="notification-icon" /> No new
                  notifications
                </p>
              )}
            </div>
            <div className="recent">
              <Link to="/inbox">
                <p>Show More</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="Dashboard-Footer">
        <div className="footer-logo">TRUSTIFY</div>
        <div className="footer-sections">
          <div className="footer-column">
            <h4>Learn More</h4>
            <ul>
              <li>
                <a href="#">About Lift</a>
              </li>
              <li>
                <a href="#">Press Releases</a>
              </li>
              <li>
                <a href="#">Country List</a>
              </li>
              <li>
                <a href="#">Help Us</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Approval</h4>
            <ul>
              <li>
                <a href="#">ID Verification</a>
              </li>
              <li>
                <a href="#">Document Process</a>
              </li>
              <li>
                <a href="#">Blockchain</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p>Head Office: +94 76 94 52 840</p>
            <p>Online Office: +94 7503 26 062</p>
          </div>
          <div className="footer-column">
            <h4>Social</h4>
            <div className="social-icons">
              <a href="#">
                <Facebook size={24} />
              </a>
              <a href="#">
                <Linkedin size={24} />
              </a>
              <a href="#">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
