import React from "react";
import "./record.css"; // Import the Record CSS file

const Record = () => {
  return (
    <div className="record-container">
      <h2>Your Identity Verification History</h2>

      <div className="record-section">
        <h3 className="record-title">✅ Approved Requests</h3>
        <p>Government or business approvals.</p>
      </div>

      <div className="record-section">
        <h3 className="record-title">⏳ Pending Requests</h3>
        <p>Requests awaiting verification.</p>
      </div>

      <div className="record-section">
        <h3 className="record-title">❌ Revoked Access</h3>
        <p>Identity data access revoked by you.</p>
      </div>
       <div className="record-section">
        <h3 className="record-title">📜 Audit Log</h3>
        <p>Full history of when and where your identity was used.</p>
      </div>
      

      <h2>Document Vault</h2>

      <div className="record-section">
        <h3 className="record-title">📂 Manage Uploaded Documents</h3>
        <p>View and manage uploaded documents (NIC, Passport, Utility Bills).</p>
      </div>

      <div className="record-section">
        <h3 className="record-title">⬇️ Download Verified Identity Records</h3>
        <p>Download government-verified identity documents.</p>
      </div>
    </div>
  );
};

export default Record;
