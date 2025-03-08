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
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const fetchUser = async () => {
      const storedData = JSON.parse(localStorage.getItem("IsUserLogging"));
      if (!storedData || !storedData.token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          headers: { Authorization: storedData.token },
        });

        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

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
            {user ? (
              <>
                <p>{user.name}</p>
                <p>{user.email}</p>
              </>
            ) : (
              <p>Login here</p>
            )}
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
