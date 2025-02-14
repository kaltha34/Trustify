import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Services from "./component/Services/services";
import Sidebar from "./component/Sidebar/Sidebar";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default App;
