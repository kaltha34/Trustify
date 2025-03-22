import React from "react";
import { Users, ShieldCheck, Building, Settings, Database, Key, FileText, Code, UserCheck } from "lucide-react"; 
import "./People.css"; 

const People = ({ darkMode }) => {
  return (
    <div className={`main-container ${darkMode ? "dark" : "light"}`}>
      <div className="people-section">
        <h1 className="people-heading">Key People In Trustify</h1>
        <div className="people-sub">
          <div className="person-card">
            <Users className="card-icon" size={32} />
            <h2>Users (Citizens) :</h2>
            <p>Individuals using Trustify to verify their identity.</p>
          </div>
          <div className="person-card">
            <ShieldCheck className="card-icon" size={32} />
            <h2>Government Authorities :</h2>
            <p>Institutions verifying and approving digital identities.</p>
          </div>
          <div className="person-card">
            <Building className="card-icon" size={32} />
            <h2>Service Providers :</h2>
            <p>Banks, telecom providers, and businesses using Trustify for authentication.</p>
          </div>
          <div className="person-card">
            <Settings className="card-icon" size={32} />
            <h2>System Administrators :</h2>
            <p>Manage the platform and ensure security.</p>
          </div>
        </div>
      </div>

      <div className="teams-section">
        <h1 className="terms-heading">Important Terms</h1>
        <div className="term-sub">
          <div className="term-card">
            <Database className="card-icon" size={32} />
            <h2>Blockchain :</h2>
            <p>A decentralized, tamper-proof digital ledger.</p>
          </div>
          <div className="term-card">
            <Key className="card-icon" size={32} />
            <h2>DID (Decentralized Identifier) :</h2>
            <p>A unique, self-owned digital identity.</p>
          </div>
          <div className="term-card">
            <FileText className="card-icon" size={32} />
            <h2>VC (Verifiable Credential) :</h2>
            <p>A digitally signed identity document.</p>
          </div>
          <div className="term-card">
            <Code className="card-icon" size={32} />
            <h2>Smart Contracts :</h2>
            <p>Automated agreements ensuring data integrity.</p>
          </div>
          <div className="term-card">
            <UserCheck className="card-icon" size={32} />
            <h2>KYC (Know Your Customer) :</h2>
            <p>A process for identity verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;
