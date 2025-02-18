import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './component/Sidebar/Sidebar';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        
      </div>
    </Router>
  );
}

export default App;