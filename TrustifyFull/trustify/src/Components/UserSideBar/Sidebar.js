import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BarChart,
  Users,
  Package,
  MessageSquare,
  Settings,
  FileText,
  HelpCircle,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
  const email = localStorage.getItem("email"); // Store email once

  useEffect(() => {
    if (!email) return; // Stop if email is not available

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/user-info/${email}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        if (data.name) {
          setName(data.name);
          setProfileImage(data.profileImage || "");
          console.log("Name set to:", data.name);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [email]);

  const handleImageUpload = async (event) => {
    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/upload-profile-image`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.success) {
        setProfileImage(data.imageUrl); // Update the profile image URL after upload
      } else {
        console.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        window.innerWidth <= 1024 &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".menu-btn")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <Home />, path: "/user-dashboard" },
    { name: "Insight", icon: <BarChart />, path: "/insight" },
    { name: "People & Terms", icon: <Users />, path: "/people" },
    { name: "Services", icon: <Package />, path: "/services" },
    { name: "Inbox", icon: <MessageSquare />, path: "/inbox" },
    { name: "Process", icon: <Settings />, path: "/process" },
    { name: "Records", icon: <FileText />, path: "/records" },
    { name: "Help Center", icon: <HelpCircle />, path: "/helpcenter" },
  ];

  return (
    <div className="content">
      {!isOpen && (
        <button
          className="menu-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="profile">
          <div className="profile-info">
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                lineHeight: "1.5px",
                marginTop: "20px",
              }}
            >
              {name}
            </p>
            <p>{email}</p>
          </div>
        </div>

        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.name} className="menu-item">
              <Link
                to={item.path}
                className="menu-link"
                onClick={() => window.innerWidth <= 1024 && setIsOpen(false)}
                tabIndex={isOpen ? "0" : "-1"}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="theme-toggle-buttons">
          <button
            className={`theme-btn ${!darkMode ? "active" : ""}`}
            onClick={() => setDarkMode(false)}
          >
            <Sun size={16} />
            Light
          </button>
          <button
            className={`theme-btn ${darkMode ? "active" : ""}`}
            onClick={() => setDarkMode(true)}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
