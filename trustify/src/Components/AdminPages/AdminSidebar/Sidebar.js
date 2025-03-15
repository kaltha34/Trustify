import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Users,
  Sun,
  Moon,
  File,
  User,
  UploadCloud,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ setSelectedMenu }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState("/default-profile.png");
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const fetchUser = async () => {
      const storedData = JSON.parse(localStorage.getItem("IsUserLogging"));
      if (!storedData || !storedData.token) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/regular", {
          method: "GET",
          headers: { Authorization: storedData.token },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
          if (data.profileImage)
            setProfilePhoto(`http://localhost:5000${data.profileImage}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("email", user.email);

    try {
      const res = await fetch("http://localhost:5000/api/upload-profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setProfilePhoto(`http://localhost:5000${data.profileImage}`);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
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
    { name: "Profile", icon: <User />, path: "/profile" },
    { name: "Admins", icon: <Users />, path: "/admin" },
    { name: "Documents", icon: <File />, path: "/documents" },
    { name: "FAQ", icon: <HelpCircle />, path: "/faq" },
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

      <div className={`adminsidebar ${isOpen ? "open" : ""}`}>
        <div className="profile">
          <div className="profile-info">
            <label htmlFor="profile-upload" className="profile-image-label">
              <img
                src={profilePhoto}
                alt="Profile"
                className="profile-image"
                style={
                  profilePhoto === "/default-profile.png"
                    ? { display: "none" }
                    : {}
                }
              />
              {profilePhoto === "/default-profile.png" && (
                <UploadCloud size={34} className="upload-icon" />
              )}
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
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
            <li key={index} className="adminmenu-item">
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
