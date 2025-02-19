import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    createdAt: "",
  });

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      navigate("/Profile");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setAdminData({
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

  return (
    <div className="admin-dashboard">
      <h1>Welcome, {adminData.name || "Admin"} 👋</h1>
      <p><strong>Email:</strong> {adminData.email}</p>
      <p><strong>Joined on:</strong> {adminData.createdAt}</p>
    </div>
  );
};

export default AdminDashboard;
