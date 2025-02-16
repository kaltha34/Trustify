import React from "react";
import "./dashboard.css";
import { Facebook, Linkedin, Instagram } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="Dashboard-container">
      <h1>Dashboard</h1>

      <div className="Dashboard-Footer">
        <div className="footer-logo">TRUSTIFY</div>
        <div className="footer-sections">
          <div className="footer-column">
            <h4>Learn More</h4>
            <ul>
              <li>
                <a href="#">About Lift</a>
              </li>
              <li>
                <a href="#">Press Releases</a>
              </li>
              <li>
                <a href="#">Country List</a>
              </li>
              <li>
                <a href="#">Help Us</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Approval</h4>
            <ul>
              <li>
                <a href="#">ID Verification</a>
              </li>
              <li>
                <a href="#">Document Process</a>
              </li>
              <li>
                <a href="#">Blockchain</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p>Head Office: +94 76 94 52 840</p>
            <p>Online Office: +94 7503 26 062</p>
          </div>
          <div className="footer-column">
            <h4>Social</h4>
            <div className="social-icons">
              <a href="#">
                <i className="fab fa-facebook">
                  <Facebook size={24} />
                </i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin">
                  <Linkedin size={24} />
                </i>
              </a>
              <a href="#">
                <i className="fab fa-instagram">
                  <Instagram size={24} />
                </i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
