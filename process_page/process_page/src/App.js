import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Process from "./component/Process/process";
import Sidebar from "./component/Sidebar/Sidebar";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/process" element={<Process />} />
      </Routes>
    </Router>
  );
}

export default App;
