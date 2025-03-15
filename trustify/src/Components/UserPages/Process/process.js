import React from "react";

import {
  CheckCircle,
  Shield,
  Key,
  Settings,
  ArrowRight,
  Lock,
  UserCheck,
  Database,
} from "lucide-react";
import "./process.css";

const Process = () => {
  const steps = [
    {
      id: 1,
      title: "Create a Digital Identity",
      icon: <Shield className="step-icon" size={32} />,
      description: "Start your digital identity journey",
      subSteps: [
        "Register on Trustify with your NIC, passport, and proof of residence",
        "Verify your identity with biometrics (optional)",
        "Receive your DID & VC (Decentralized Identifier & Verifiable Credential)",
      ],
    },
    {
      id: 2,
      title: "Use Your Digital Identity",
      icon: <Key className="step-icon" size={32} />,
      description: "Share your verified credentials securely",
      subSteps: [
        "Log in to Trustify and share your verified credentials with government offices, banks, etc.",
        "Select what data to share (e.g., name, address, citizenship)",
      ],
    },
    {
      id: 3,
      title: "Identity Verification Process",
      icon: <CheckCircle className="step-icon" size={32} />,
      description: "Quick and secure verification",
      subSteps: [
        "Institutions verify your identity using blockchain records",
        "Receive a confirmation notification when verification is successful",
      ],
    },
    {
      id: 4,
      title: "Data Control & Security",
      icon: <Settings className="step-icon" size={32} />,
      description: "Maintain control of your data",
      subSteps: [
        "Revoke access to shared identity details anytime",
        "Manage who can view your credentials",
      ],
    },
  ];

  const features = [
    {
      title: "Why Choose Trustify?",
      items: [
        "Advanced blockchain security",
        "Quick and easy verification",
        "Complete data control",
        "24/7 Support",
      ],
    },
    {
      title: "Security Features",
      items: [
        "End-to-end encryption",
        "Tamper-proof records",
        "Biometric authentication",
        "Decentralized storage",
      ],
    },
  ];

  return (
    <div className="process-content">

    
    <div className="process-container">
      {/* Header Section */}
      <div className="process-header">
        <div className="header-content">
          <h1>Identity Verification Process</h1>
          <p className="process-description">
            Secure your digital identity with Trustify's advanced blockchain
            technology
          </p>
        </div>
        <div className="header-graphic">
          <div className="graphic-identity">
            <div className="identity-circle">
              <Lock className="center-icon" size={32} />
            </div>
            <div className="identity-rings">
              <div className="ring ring-1">
                <UserCheck className="orbital-icon" size={24} />
              </div>
              <div className="ring ring-2">
                <Shield className="orbital-icon" size={24} />
              </div>
              <div className="ring ring-3">
                <Database className="orbital-icon" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-container">
        {steps.map((step, index) => (
          <div key={step.id} className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-number">
                <span>{step.id}</span>
              </div>
              <div className="timeline-card">
                <div className="card-header">
                  {step.icon}
                  <h2>{step.title}</h2>
                </div>
                <p className="card-description">{step.description}</p>
                <ul className="sub-steps">
                  {step.subSteps.map((subStep, idx) => (
                    <li key={idx}>
                      <ArrowRight size={16} className="arrow-icon" />
                      {subStep}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {index < steps.length - 1 && <div className="timeline-connector" />}
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="info-section">
        {features.map((feature, index) => (
          <div key={index} className="info-card">
            <h3>{feature.title}</h3>
            <ul>
              {feature.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Process;
