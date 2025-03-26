import React from "react";
import { Link } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";
import "./UserLayout.css";

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <div className="content">{children}</div>
      <div className="help-button">
        <Link to="/helpcenter">
          <FaQuestionCircle size={55} color="white" />
        </Link>
      </div>
    </div>
  );
};

export default UserLayout;
