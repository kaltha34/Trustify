import { User, LogOut } from "lucide-react";
import "./Profile.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [adminData, setAdminData] = useState({
    _id: "",
    name: "",
    email: "",
    createdAt: "",
  });
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("email");
    navigate("/login");
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/admin/profile",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        setAdminData({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          createdAt: new Date(response.data.createdAt).toLocaleDateString(),
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
        navigate("/");
      }
    };

    fetchAdminData();
  }, [navigate, authToken]);

  // if (!setAdmin) {
  //   return <p>Loading profile... Please wait.</p>;
  // }

  return (
    <div className="profile-container">
      <button className="adminlogout-button" onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </button>
      <div className="profile-header">
        <User size={80} className="profile-icon" />
      </div>

      <div className="profile-details">
        <div className="detail-box">
          <h4>Name</h4>
          <p>{adminData.name}</p>
        </div>
        <div className="detail-box">
          <h4>Email</h4>
          <p>{adminData.email}</p>
        </div>
        <div className="detail-box">
          <h4>ID</h4>
          <p>{adminData._id}</p>
        </div>
        <div className="detail-box">
          <h4>Registration Date</h4>
          <p>{new Date(adminData.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
