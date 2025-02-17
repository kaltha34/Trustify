import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";
import SideBar from "./Components/Sidebar/Sidebar";
import UploadDoc from "./pages/UploadDoc/Upload";

function App() {
  return (
    <Router>
      <SideBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadDoc />} />
      </Routes>
    </Router>
  );
}

export default App;
