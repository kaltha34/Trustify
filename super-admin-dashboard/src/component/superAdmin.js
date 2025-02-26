import "./superAdmin.css";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

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
  const [superAdmin, setSuperAdmin] = useState(null);

  //debugging console
  useEffect(() => {
    console.log("Users:", users);
    console.log("Admins:", admins);
  }, [users, admins]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, adminsRes, superAdminRes] = await Promise.all([
          fetch("http://localhost:5000/api/users/regular"),
          fetch("http://localhost:5000/api/admins"),
          fetch("http://localhost:5000/api/super-admin"),
        ]);

        if (!usersRes.ok || !adminsRes.ok || !superAdminRes.ok) {
          throw new Error("Failed to fetch data");
        }

        let usersData = await usersRes.json();
        const adminData = await adminsRes.json();
        const superAdminData = await superAdminRes.json();

        setUsers(usersData);
        setSuperAdmin(superAdminData);

        // Ensure the super admin is only added once
        const uniqueAdmins = [superAdminData, ...adminData].filter(
          (admin, index, self) =>
            index === self.findIndex((a) => a.email === admin.email)
        );
        setAdmins(uniqueAdmins);
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

      const updatedAdminsRes = await fetch("http://localhost:5000/api/admins");
      if (updatedAdminsRes.ok) {
        const updatedAdmins = await updatedAdminsRes.json();
        setAdmins(updatedAdmins);
      }

      closeModal();
    } catch (error) {
      console.error("Error assigning admin:", error);
    }
  };

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
                  .filter(
                    (user) =>
                      user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      user.email !== superAdmin?.email
                  )
                  .map((user, index) => {
                    const isAdmin = admins.some(
                      (admin) => admin.email === user.email
                    );

                    return (
                      <li key={index} className="admin-item">
                        {getHighlightedText(user.email, searchTerm)}
                        <button
                          className="assign-btn"
                          onClick={() => handleAssignClick(user.email)}
                          disabled={isAdmin}
                          style={{
                            backgroundColor: isAdmin ? "#ccc" : "#4caf50",
                            cursor: isAdmin ? "not-allowed" : "pointer",
                          }}
                        >
                          {isAdmin ? "Already Admin" : "Click to Assign"}
                        </button>
                      </li>
                    );
                  })}
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
                    {admin.email === superAdmin?.email && (
                      <span className="super-admin-tag">Super Admin</span>
                    )}
                    {admin.email !== superAdmin?.email && (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveClick(admin.email)}
                      >
                        Click to Remove
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p className="no-users">No admins assigned yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

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
