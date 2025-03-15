import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import "./UserLayout.css";

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <div className="content">{children}</div>
      <div className="help-button">
        <Link to="/helpcenter">
          <HelpCircle size={55} color="white" />
        </Link>
      </div>
    </div>
  );
};

export default UserLayout;
