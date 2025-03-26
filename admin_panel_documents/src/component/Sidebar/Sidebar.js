import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  HelpCircle,
  Users,
  File,
  Sun,
  User,
  
  Moon,
  MessageCircle,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const menuItems = [
    { name: "Profile", icon: <User/>, path: "/" },
    { name: "Admins", icon: <Users />, path: "/admin" },
    { name: "Documents", icon: <File />, path: "/documents" },
    { name: "FAQ", icon: <HelpCircle />, path: "/faq" },
    { name: "Reply", icon: <MessageCircle />, path: "/reply" },

    
  ];

  return (
    <div className="Content">
      <div className="sidebar">
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
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <Link to={item.path} className="menu-link">
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