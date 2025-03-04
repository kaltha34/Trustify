import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaFileAlt } from "react-icons/fa";
import "./PeopleAndTerms.css"; // Import the CSS file

const PeopleAndTerms = ({ darkMode }) => {
  const navigate = useNavigate();

  return (
    <div
      className="container"
      style={{ backgroundColor: darkMode ? "#121212" : "#f4f4f4" }}
    >
      <div
        className="card"
        style={{
          backgroundColor: darkMode ? "#1e1e1e" : "#e0e0e0",
          color: darkMode ? "white" : "black",
        }}
        onClick={() => navigate("/people-details")}
      >
        <FaUser
          size={50}
          className="icon"
          style={{ color: darkMode ? "white" : "black" }}
        />
        <p className="text" style={{ color: darkMode ? "white" : "black" }}>
          Key People in Trustify
        </p>
      </div>

      <div
        className="card"
        style={{
          backgroundColor: darkMode ? "#1e1e1e" : "#e0e0e0",
          color: darkMode ? "white" : "black",
        }}
        onClick={() => navigate("/terms-details")}
      >
        <FaFileAlt
          size={50}
          className="icon"
          style={{ color: darkMode ? "white" : "black" }}
        />
        <p className="text" style={{ color: darkMode ? "white" : "black" }}>
          Important Terms
        </p>
      </div>
    </div>
  );
};

export default PeopleAndTerms;
