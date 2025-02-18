import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./component/Sidebar/Sidebar";
import HelpCenter from "./component/HelpCenter/HelpCenter";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/helpcenter" element={<HelpCenter />} />
      </Routes>
    </Router>
  );
}

export default App;