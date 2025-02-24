import "./superAdmin.css";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Modal Component
const Modal = ({ email, onClose, onConfirm }) => (
  <div className="modal-overlay">
    <div className="modal">
      <h2 className="modal-text ">
        Are you sure <br />
        you want to assign admin to <br />
        {email}?
      </h2>
      <button onClick={() => onConfirm(email)} className="model-yes">
        Yes, Assign
      </button>
      <button onClick={onClose} className="model-cancel">
        Cancel
      </button>
    </div>
  </div>
);

const SuperAdmin = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/regular");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        console.log("Fetched users from API:", data); //
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admins");
        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }
        const data = await response.json();
        console.log("Fetched admins from API:", data);

        if (!Array.isArray(data)) {
          throw new Error("API response is not an array");
        }

        setAdmins(data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
    fetchUsers();
  }, []);

  const handleAssignClick = (email) => {
    setSelectedEmail(email);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmail(null);
  };

  const handleConfirmAssign = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/api/assignAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign admin");
      }

      setUsers(users.filter((user) => user.email !== email));

      const adminResponse = await fetch("http://localhost:5000/api/admins");
      const updatedAdmins = await adminResponse.json();
      setAdmins(updatedAdmins);

      closeModal();
    } catch (error) {
      console.error("Error assigning admin:", error);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getHighlightedText = (email, query) => {
    if (!query) return email;
    const parts = email.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="SuperAdminDashboard">
      <div className="SuperAdmin-content">
        <h1>Super Admin Dashboard</h1>
        <div className="grid-container">
          {/* Admin List Section */}
          <div className="Admins">
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Users..."
                className="search-bar"
              />
              {searchTerm && <X className="clear-icon" onClick={clearSearch} />}
            </div>

            <h2>Users List</h2>

            {users.length === 0 ? (
              <p className="no-users">No users available.</p>
            ) : (
              <ul className="admin-list">
                {users.filter((user) =>
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                ).length > 0 ? (
                  users
                    .filter((user) =>
                      user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((user, index) => (
                      <li key={index} className="admin-item">
                        {getHighlightedText(user.email, searchTerm)}
                        <button
                          className="assign-btn"
                          onClick={() => handleAssignClick(user.email)}
                        >
                          Assign Admin
                        </button>
                      </li>
                    ))
                ) : (
                  <p className="no-results">No matching admins found.</p>
                )}
              </ul>
            )}
          </div>

          {/* Added Admins Section */}
          <div className="Added-admins">
            <h2>Admins List</h2>
            <ul className="added-admin-list">
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <li key={index} className="added-admin-item">
                    {admin.email}{" "}
                  </li>
                ))
              ) : (
                <p className="no-users">No admins assigned yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Render the modal when modalVisible is true */}
      {modalVisible && (
        <Modal
          email={selectedEmail}
          onClose={closeModal}
          onConfirm={handleConfirmAssign}
        />
      )}
    </div>
  );
};

export default SuperAdmin;
