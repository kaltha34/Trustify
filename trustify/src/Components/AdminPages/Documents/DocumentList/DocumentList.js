import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import './DocumentList.css';

const DocumentList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin] = useState(true); // In real app, this would come from auth context

  // Initialize documents state from localStorage or with default values
  const [documents, setDocuments] = useState(() => {
    const savedDocs = localStorage.getItem('documentBlockStatus');
    if (savedDocs) {
      return JSON.parse(savedDocs);
    }
    
    return {
      pending: Array.from({ length: 8 }, (_, i) => ({
        id: '12345678',
        index: i + 1,
        isBlocked: false
      })),
      verified: Array.from({ length: 8 }, (_, i) => ({
        id: '12345678',
        index: i + 1,
        isBlocked: false
      }))
    };
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Save documents state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('documentBlockStatus', JSON.stringify(documents));
  }, [documents]);

  const handleBlock = (e, status, index) => {
    e.stopPropagation(); // Prevent navigation when clicking block button
    
    setDocuments(prevDocs => ({
      ...prevDocs,
      [status]: prevDocs[status].map((doc, i) => 
        i === index - 1 ? { ...doc, isBlocked: !doc.isBlocked } : doc
      )
    }));
  };

  const renderIdItem = (doc, status) => (
    <div key={doc.index} className="id-item">
      <div 
        className="id-content"
        onClick={() => navigate(`/documents/${doc.id}?status=${status}`)}
      >
        {doc.index}. ID : {doc.id}
      </div>
      {isAdmin && (
        <button
          className={`block-button ${doc.isBlocked ? 'blocked' : ''}`}
          onClick={(e) => handleBlock(e, status, doc.index)}
        >
          {doc.isBlocked ? 'Unblock' : 'Block'}
        </button>
      )}
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="document-list">
      <div className="list-container">
        <div className="list-header">
          <h2>Pending</h2>
          <span className="status-icon pending">⏳</span>
        </div>
        <div className="id-list">
          {documents.pending.map(doc => renderIdItem(doc, 'pending'))}
        </div>
      </div>

      <div className="list-container">
        <div className="list-header">
          <h2>Verified</h2>
          <span className="status-icon verified">✓</span>
        </div>
        <div className="id-list">
          {documents.verified.map(doc => renderIdItem(doc, 'verified'))}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;