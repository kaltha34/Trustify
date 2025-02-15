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
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(true);

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
    { name: "Dashboard", icon: <Home />, path: "/dashboard" },
    { name: "Insight", icon: <BarChart />, path: "/insight" },
    { name: "People & Teams", icon: <Users />, path: "/teams" },
    { name: "Services", icon: <Package />, path: "/services" },
    { name: "Inbox", icon: <MessageSquare />, path: "/inbox" },
    { name: "Process", icon: <Settings />, path: "/process" },
    { name: "Records", icon: <FileText />, path: "/records" },
    { name: "Help Center", icon: <HelpCircle />, path: "/helpcenter" },
  ];

  return (
    <div className="Content">
      <div className="sidebar">
        <div className="profile">
          <img src="/image.jpe" alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h3>Kalhara Thabrew</h3>
            <p>kalhara.s.thabrew@gmail.com</p>
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
