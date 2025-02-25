import "./superAdmin.css";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Modal Component for Assign Admin
const ModalAssign = ({ email, onClose, onConfirm }) => (
  <div className="modal-overlay">
    <div className="modal">
      <h2 className="modal-text">
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

// Modal Component for Remove Admin
const ModalRemove = ({ email, onClose, onConfirm }) => (
  <div className="modal-overlay">
    <div className="modal">
      <h2 className="modal-text">
        Are you sure <br />
        you want to remove admin rights from <br />
        {email}?
      </h2>
      <button onClick={() => onConfirm(email)} className="model-yes">
        Yes, Remove
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
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Fetch users and admins
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, adminsRes] = await Promise.all([
          fetch("http://localhost:5000/api/users/regular"),
          fetch("http://localhost:5000/api/admins"),
        ]);

        if (!usersRes.ok || !adminsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        setUsers(await usersRes.json());
        setAdmins(await adminsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAssignClick = (email) => {
    setSelectedEmail(email);
    setModalVisible(true);
  };

  const handleRemoveClick = (email) => {
    setSelectedEmail(email);
    setRemoveModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmail(null);
  };

  const closeRemoveModal = () => {
    setRemoveModalVisible(false);
    setSelectedEmail(null);
  };

  // Assign Admin
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

      const updatedAdminsRes = await fetch("http://localhost:5000/api/admins");
      if (updatedAdminsRes.ok) {
        setAdmins(await updatedAdminsRes.json());
      }

      closeModal();
    } catch (error) {
      console.error("Error assigning admin:", error);
    }
  };

  // Remove Admin
  const handleConfirmRemove = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/api/removeAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove admin");
      }

      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.email !== email)
      );

      const updatedUsersRes = await fetch(
        "http://localhost:5000/api/users/regular"
      );
      if (updatedUsersRes.ok) {
        setUsers(await updatedUsersRes.json());
      }

      closeRemoveModal();
    } catch (error) {
      console.error("Error removing admin:", error);
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
          {/* Users List Section */}
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
                {users
                  .filter((user) =>
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                  ))}
              </ul>
            )}
          </div>

          {/* Admins List Section */}
          <div className="Added-admins">
            <h2>Admins List</h2>
            <ul className="added-admin-list">
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <li key={index} className="added-admin-item">
                    {admin.email}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveClick(admin.email)}
                    >
                      Remove Admin
                    </button>
                  </li>
                ))
              ) : (
                <p className="no-users">No admins assigned yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Render the modals when visible */}
      {modalVisible && (
        <ModalAssign
          email={selectedEmail}
          onClose={closeModal}
          onConfirm={handleConfirmAssign}
        />
      )}
      {removeModalVisible && (
        <ModalRemove
          email={selectedEmail}
          onClose={closeRemoveModal}
          onConfirm={handleConfirmRemove}
        />
      )}
    </div>
  );
};

export default SuperAdmin;
