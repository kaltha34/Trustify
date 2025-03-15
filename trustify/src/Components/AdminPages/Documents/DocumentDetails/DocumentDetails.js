import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import PDFIcon from '../shared/PDFIcon';
import './DocumentDetails.css';

const DocumentDetails = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const status = searchParams.get('status');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="document-details">
      <div className={`status-banner ${status}`}>
        <span className="status-text">
          {status === 'verified' ? 'Verified' : 'Pending'}
        </span>
        <span className="status-icon">
          {status === 'verified' ? '✓' : '⏳'}
        </span>
      </div>

      <div className="user-profile">
        <div className="profile-picture" />
        <div className="user-info">
          <div>ID : 12345678</div>
          <div>Name : Kalhara Thabrew</div>
          <div>Email : kalhara.s.thabrew@gmail.com</div>
        </div>
      </div>

      <div className="documents-grid">
        {['Birth Certificate', 'NIC', 'Passport'].map((doc, index) => (
          <div key={index} className="document-card">
            <PDFIcon />
            <div className="document-name">{doc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentDetails;