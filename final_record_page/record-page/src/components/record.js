import React from "react";
import "./record.css"; // Import the Record CSS file

const Record = () => {
  const [isApprovedOpen, setIsApprovedOpen] = useState(false);
  const [isPendingOpen, setIsPendingOpen] = useState(false);
  const [isRevokedOpen, setIsRevokedOpen] = useState(false);
  return (
    <div className="record-container">
      <h2>Your Identity Verification History</h2>

       {/* Approved Requests Section with Dropdown */}
    <div className="record-section">
      <h3 
        className="record-title" 
        onClick={() => setIsApprovedOpen(!isApprovedOpen)}
      >
        ✅ Approved Requests
        <span className={`arrow-icon ${isApprovedOpen ? "open" : ""}`}>▼</span>
       </h3>
  
      {isApprovedOpen && (
        <div className="approved-requests-dropdown">
          <p>Government or business approvals.</p>
          <ul>
            <li>file1.pdf</li>
            <li>file2.pdf</li>
            <li>file3.pdf</li>
          </ul>
        </div>
      )}
    </div>

       {/* Pending Requests Section with Dropdown */}
       <div className="record-section">
        <h3 className="record-title" onClick={() => setIsPendingOpen(!isPendingOpen)}>
          ⏳ Pending Requests
          <span className={`arrow-icon ${isApprovedOpen ? "open" : ""}`}>▼</span>
        </h3>
        {isPendingOpen && (
          <div className="pending-requests-dropdown">
            <p>Requests awaiting verification.</p>
            <ul>
              <li>file4.pdf</li>
              <li>file5.pdf</li>
              <li>file6.pdf</li>
            </ul>
          </div>
        )}
      </div>

         {/* Revoked Access Section with Dropdown */}
      <div className="record-section">
        <h3 className="record-title" onClick={() => setIsRevokedOpen(!isRevokedOpen)}>
          ❌ Revoked Access
          <span className={`arrow-icon ${isApprovedOpen ? "open" : ""}`}>▼</span>
        </h3>
        {isRevokedOpen && (
          <div className="revoked-access-dropdown">
            <p>Identity data access revoked by you.</p>
            <ul>
              <li>file7.pdf</li>
              <li>file8.pdf</li>
              <li>file9.pdf</li>
            </ul>
          </div>
        )}
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
