import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  FileText,
  Users,
  ShieldCheck,
} from "lucide-react";
import "./dash.css";

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
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome, {adminData.name || "Admin"} 👋
      </motion.h1>

      {/* Admin Cards Container */}
      <div className="admin-dashboard-container">
        {/* Admin Info Card */}
        <div className="admin-card">
          <h3>Admin Info</h3>
          <div className="admin-info">
            <User size={20} />
            <p>
              <strong>Name:</strong> {adminData.name}
            </p>
          </div>
          <div className="admin-info">
            <Mail size={20} />
            <p>
              <strong>Email:</strong> {adminData.email}
            </p>
          </div>
          <div className="admin-info">
            <Calendar size={20} />
            <p>
              <strong>Joined on:</strong> {adminData.createdAt}
            </p>
          </div>
        </div>

        {/* Admin Actions Card */}
        <div className="admin-card admin-actions">
          <h3>Admin Actions</h3>
          <p>
            <FileText size={18} /> You can review and verify uploaded documents.
          </p>
          <p>
            <Users size={18} /> Manage user accounts and their verification
            status.
          </p>
          <p>
            <ShieldCheck size={18} /> Ensure document authenticity using
            blockchain technology.
          </p>
          <p>Maintain system security and monitor user activities.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
