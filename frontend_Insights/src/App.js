import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./component/Sidebar/Sidebar";
import InsightsPage from "./component/InsightsPage/InsightsPage";

function App() {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px" }}> {/* Adjust margin if needed */}
        <Routes>
          <Route path="/insight" element={<InsightsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
