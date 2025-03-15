import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dash.css";
import { motion } from "framer-motion";

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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome, {adminData.name || "Admin"} 👋
      </motion.h1>
      <p>
        <strong>Email:</strong> {adminData.email}
      </p>
      <p>
        <strong>Joined on:</strong> {adminData.createdAt}
      </p>
    </div>
  );
};

export default AdminDashboard;
