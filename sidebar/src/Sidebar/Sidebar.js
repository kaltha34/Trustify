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
  X,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [name, setName] = useState("Kalhara Thabrew");
  const [email, setEmail] = useState("kalhara.s.thabrew@gmail.com");
  const [darkMode, setDarkMode] = useState(true);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div className="content">
      <button
        className="menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="profile">
          <img src="/image.jpe" alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h3>{name}</h3>
            <p>{email}</p>
          </div>
        </div>

        <ul className="menu">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
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
