import { User, LogOut } from "lucide-react";
import "./Profile.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [admin, setAdmin] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, admin not logged in.");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/admin/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAdmin(res.data.admin); // Ensure backend sends { admin: {...} }
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchProfile();
  }, []);

  // if (!setAdmin) {
  //   return <p>Loading profile... Please wait.</p>;
  // }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <User size={80} className="profile-icon" />
      </div>
      <button className="adminlogout-button" onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </button>
      <div className="profile-details">
        <div className="detail-box">
          <h4>Name</h4>
          <p>{admin.name}</p>
        </div>
        <div className="detail-box">
          <h4>Email</h4>
          <p>{admin.email}</p>
        </div>
        <div className="detail-box">
          <h4>ID</h4>
          <p>{admin._id}</p>
        </div>
        <div className="detail-box">
          <h4>Registration Date</h4>
          <p>{new Date(admin.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
