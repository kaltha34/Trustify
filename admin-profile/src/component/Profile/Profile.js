import React from "react";
import { User } from "lucide-react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <User size={50} className="profile-icon" />
      </div>
      <div className="profile-details">
        <div className="detail-box">
          <h4>Name</h4>
          <p>Kalhara Thabrew</p>
        </div>
        <div className="detail-box">
          <h4>Email</h4>
          <p>kalhara.s.thabrew@gmail.com</p>
        </div>
        <div className="detail-box">
          <h4>ID</h4>
          <p>12345678</p>
        </div>
        <div className="detail-box">
          <h4>Registration Date</h4>
          <p>12/01/2022</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
