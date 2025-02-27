import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuperAdminLogIn from "./compenent/superadmin/SuperAdminLogIn";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SuperAdminLogIn />} />

      </Routes>
    </Router>
  );
}

export default App;
