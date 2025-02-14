import React, { useState } from "react";
import {
  Shield,
  UserCheck,
  Settings2,
  FileText,
  Lock,
  Brain,
  Search,
  
} from "lucide-react";
import "./services.css";

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="service-card">
    <div className="service-icon">
      <Icon size={32} />
    </div>
    <div className="service-content">
      <h3>{title}</h3>
      <p>{description}</p>
      
    </div>
    <div className="card-decoration"></div>
  </div>
);

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const services = [
    {
      icon: UserCheck,
      title: "Digital Identity Creation",
      description:
        "Securely create and store your unique digital identity on a blockchain network for future-proof verification.",
    },
    {
      icon: Shield,
      title: "Secure Identity Verification",
      description:
        "Verify identities with confidence using our advanced blockchain-based verification system.",
    },
    {
      icon: Settings2,
      title: "Compliance Management",
      description:
        "Stay compliant with automated tracking and reporting of identity verification processes.",
    },
    {
      icon: FileText,
      title: "Document Storage",
      description:
        "Store and manage sensitive documents with enterprise-grade encryption and blockchain security.",
    },
    {
      icon: Lock,
      title: "Access Permissions",
      description:
        "Control and monitor access to your digital identity with granular permission settings.",
    },
    {
      icon: Brain,
      title: "AI-Powered Fraud Detection",
      description:
        "Leverage advanced AI algorithms to detect and prevent identity fraud in real-time.",
    },
  ];

  const filteredServices = services.filter(
    service =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="services-container">
      <div className="services-header">
        <div className="header-content">
          <h1>
            Our <span>Services</span>
          </h1>
          <p className="services-subtitle">
            Comprehensive identity verification solutions powered by blockchain technology
          </p>
        </div>
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

      <div className="services-footer">
        <div className="stats-container">
          <div className="stat-item">
            <h4>10K+</h4>
            <p>Active Users</p>
          </div>
          <div className="stat-item">
            <h4>99.9%</h4>
            <p>Uptime</p>
          </div>
          <div className="stat-item">
            <h4>24/7</h4>
            <p>Support</p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Services;