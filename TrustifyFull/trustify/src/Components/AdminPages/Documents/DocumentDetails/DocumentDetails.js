import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";
import PDFIcon from "../shared/PDFIcon";
import "./DocumentDetails.css";

const DocumentDetails = () => {
  const { id } = useParams(); // Get 'id' from the URL path
  const [searchParams] = useSearchParams(); // Get query parameters
  const status = searchParams.get("status"); // Get 'status' from the query string
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState({});

  useEffect(() => {
    setTimeout(() => {
      try {
        const savedDocs =
          JSON.parse(localStorage.getItem("documentBlockStatus")) || {};
        const doc = savedDocs[status]?.find((doc) => doc.id === id);
        setDocument(doc || {});
      } catch (error) {
        console.error("Error fetching document details:", error);
        setDocument({});
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, [id, status]);

  if (isLoading) return <LoadingSpinner />;
  if (!document.id) return <div>Document not found!</div>;

  const statusText = status === "verified" ? "Verified" : "Pending";
  const statusIcon = status === "verified" ? "✓" : "⏳";

  return (
    <div className="document-details">
      <div className={`status-banner ${status}`}>
        <span className="status-text">{statusText}</span>
        <span className="status-icon">{statusIcon}</span>
      </div>

      <div className="user-profile">
        <div className="user-info">
          <div>ID : {document.id}</div>
          <div>Name : Chamidu Lakshan</div>
          <div>Email : lakshanchamidu.994@gmail|| "No email provided"</div>
        </div>
      </div>

      <div className="documents-grid">
        {(document.documents || []).length > 0 ? (
          document.documents.map((doc, index) => (
            <div key={index} className="document-card">
              <PDFIcon />
              <div className="document-name">{doc.name}</div>
            </div>
          ))
        ) : (
          <div>No documents available</div>
        )}
      </div>
    </div>
  );
};

export default DocumentDetails;
