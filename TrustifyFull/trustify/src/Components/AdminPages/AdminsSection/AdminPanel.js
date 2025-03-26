import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admins");
        const data = await response.json();
        const formattedUsers = data.map((user) => ({
          ...user,
          status: "offline",
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "offline" ? "online" : "offline",
            }
          : user
      )
    );
  };

  return (
    <div className="admin-panel1">
      <h2>ADMIN PANEL</h2>
      <div className="grid-container1">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="grid-item1">
              <div className="status-toggle">
                <button
                  className={`status-btn ${
                    user.status === "online" ? "online" : "offline"
                  }`}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.status === "online" ? "Online" : "Offline"}
                </button>
              </div>

              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          ))
        ) : (
          <p>Loading users...</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
