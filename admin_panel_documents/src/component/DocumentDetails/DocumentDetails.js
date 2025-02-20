import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';

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

      
    </div>
  );
};

export default DocumentDetails;