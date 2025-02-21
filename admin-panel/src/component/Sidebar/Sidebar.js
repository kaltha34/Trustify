import React, { useState, useEffect } from "react";
import { Home, Users, Sun, Moon, File, FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";  // Import Link from React Router
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
    { name: "Profile", icon: <Home />, link: "/" },
    { name: "Admin Panel", icon: <Users />, link: "/admin" },
    { name: "Documents", icon: <File />, link: "/documents" },
    { name: "FAQ", icon: <FileQuestion />, link: "/FAQ" },
  ];

  return (
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
            <Link to={item.link} className="menu-link">
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
  );
};

export default Sidebar;
