import React, { useState } from "react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [isLightMode, setIsLightMode] = useState(true);
  const [status, setStatus] = useState({
    container1: "offline",
    container2: "offline",
    container3: "offline",
    container4: "offline",
    container5: "offline",
    container6: "offline",
  });

  const toggleMode = () => {
    setIsLightMode(!isLightMode);
  };

  const toggleStatus = (container) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [container]: prevStatus[container] === "offline" ? "online" : "offline",
    }));
  };

  return (
    <div className={`admin-panel ${isLightMode ? "light-mode" : "dark-mode"}`}>
      <h2>ADMIN PANEL</h2>
      <button onClick={toggleMode}>
        Switch to {isLightMode ? "Dark" : "Light"} Mode
      </button>
      <div className="grid-container">
        <div className="grid-item container1">
          <div className="status-toggle">
            <button
              className={`status-btn ${status.container1 === "online" ? "online" : "offline"}`}
              onClick={() => toggleStatus("container1")}
            >
              {status.container1 === "online" ? "Online" : "Offline"}
            </button>
          </div>
          <img
            src="https://via.placeholder.com/80" // Replace with actual profile picture URL
            alt="Profile 1"
            className="profile-pic"
          />
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>ID:</strong> 001</p>
        </div>
        <div className="grid-item container2">
          <div className="status-toggle">
            <button
              className={`status-btn ${status.container2 === "online" ? "online" : "offline"}`}
              onClick={() => toggleStatus("container2")}
            >
              {status.container2 === "online" ? "Online" : "Offline"}
            </button>
          </div>
          <img
            src="https://via.placeholder.com/80" // Replace with actual profile picture URL
            alt="Profile 2"
            className="profile-pic"
          />
          <p><strong>Name:</strong> Jane Smith</p>
          <p><strong>Email:</strong> jane.smith@example.com</p>
          <p><strong>ID:</strong> 002</p>
        </div>
        <div className="grid-item container3">
          <div className="status-toggle">
            <button
              className={`status-btn ${status.container3 === "online" ? "online" : "offline"}`}
              onClick={() => toggleStatus("container3")}
            >
              {status.container3 === "online" ? "Online" : "Offline"}
            </button>
          </div>
          <img
            src="https://via.placeholder.com/80" // Replace with actual profile picture URL
            alt="Profile 3"
            className="profile-pic"
          />
          <p><strong>Name:</strong> Mark Johnson</p>
          <p><strong>Email:</strong> mark.johnson@example.com</p>
          <p><strong>ID:</strong> 003</p>
        </div>
        <div className="grid-item container4">
          <div className="status-toggle">
            <button
              className={`status-btn ${status.container4 === "online" ? "online" : "offline"}`}
              onClick={() => toggleStatus("container4")}
            >
              {status.container4 === "online" ? "Online" : "Offline"}
            </button>
          </div>
          <img
            src="https://via.placeholder.com/80" // Replace with actual profile picture URL
            alt="Profile 4"
            className="profile-pic"
          />
          <p><strong>Name:</strong> Emma Brown</p>
          <p><strong>Email:</strong> emma.brown@example.com</p>
          <p><strong>ID:</strong> 004</p>
        </div>
        <div className="grid-item container5">
          <div className="status-toggle">
            <button
              className={`status-btn ${status.container5 === "online" ? "online" : "offline"}`}
              onClick={() => toggleStatus("container5")}
            >
              {status.container5 === "online" ? "Online" : "Offline"}
            </button>
          </div>
          <img
            src="https://via.placeholder.com/80" // Replace with actual profile picture URL
            alt="Profile 5"
            className="profile-pic"
          />
          <p><strong>Name:</strong> Lucas White</p>
          <p><strong>Email:</strong> lucas.white@example.com</p>
          <p><strong>ID:</strong> 005</p>
        </div>
        <div className="grid-item container6">
          <div className="status-toggle">
            <button
              className={`status-btn ${status.container6 === "online" ? "online" : "offline"}`}
              onClick={() => toggleStatus("container6")}
            >
              {status.container6 === "online" ? "Online" : "Offline"}
            </button>
          </div>
          <img
            src="https://via.placeholder.com/80" // Replace with actual profile picture URL
            alt="Profile 6"
            className="profile-pic"
          />
          <p><strong>Name:</strong> Olivia Green</p>
          <p><strong>Email:</strong> olivia.green@example.com</p>
          <p><strong>ID:</strong> 006</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
