import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Sidebar from './component/Sidebar/Sidebar';
import DocumentList from './component/DocumentList/DocumentList';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/documents" element={<DocumentList />} />
           
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;