import React from "react";
import "./record.css"; // Import the Record CSS file

const Record = () => {
  const [isApprovedOpen, setIsApprovedOpen] = useState(false);
  const [isPendingOpen, setIsPendingOpen] = useState(false);
  const [isRevokedOpen, setIsRevokedOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const handleFileClick = (fileName) => {
    // Logic to open a blank page (this could be a new window or route to a new page)
    window.open('', '_blank');  // Opens a blank page
  };
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
            <li onClick={()=> handleFileClick('file1.pdf')}>file📂</li>
            <li onClick={()=> handleFileClick('file1.pdf')}>file📂</li>
            <li onClick={()=> handleFileClick('file1.pdf')}>file📂</li>
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
              <li onClick={()=> handleFileClick('file1.pdf')}>file📂</li>
              <li onClick={()=> handleFileClick('file1.pdf')}>file📂</li>
              <li onClick={()=> handleFileClick('file1.pdf')}>file📂</li>
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
              <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
              <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
              <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
            </ul>
          </div>
        )}
      </div>
       {/* Audit Log Section with Dropdown */}
      <div className="record-section">
        <h3 className="record-title" onClick={() => setIsAuditLogOpen(!isAuditLogOpen)}>
          📜 Audit Log
          <span className={`arrow-icon ${isApprovedOpen ? "open" : ""}`}>▼</span>
        </h3>
        {isAuditLogOpen && (
          <div className="audit-log-dropdown">
            <p>Full history of when and where your identity was used.</p>
            <ul>
              <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
              <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
              <li onClick={() => handleFileClick('file1.pdf')}>ffile📂</li>
            </ul>
          </div>
        )}
      </div>
      

      <h2>Document Vault</h2>

      <div className="record-section">
      <h3 
        className="record-title" 
        onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
      >
        📂 Manage Uploaded Documents
        <span className={`arrow-icon ${isDocumentsOpen ? "open" : ""}`}>▼</span>
      </h3>
      <p>View and manage uploaded documents (NIC, Passport, Utility Bills).</p>

      {isDocumentsOpen && (
        <div className="documents-dropdown">
          <ul>
            <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
            <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
            <li onClick={() => handleFileClick('file1.pdf')}>file📂</li>
          </ul>
        </div>
      )}
    </div>

      <div className="record-section">
        <h3 
          className="record-title" 
          onClick={() => setIsDownloadOpen(!isDownloadOpen)}
        >
          ⬇️ Download Verified Identity Records
          <span className={`arrow-icon ${isDownloadOpen ? "open" : ""}`}>▼</span>
        </h3>
        <p>Download government-verified identity documents.</p>

        {isDownloadOpen && (
          <div className="download-dropdown">
            <ul>
              <li><a href="/path/to/file2.pdf" download>file   📂</a></li>
              <li><a href="/path/to/file3.pdf" download>file   📂</a></li>
              <li><a href="/path/to/file4.pdf" download>file   📂</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Record;
