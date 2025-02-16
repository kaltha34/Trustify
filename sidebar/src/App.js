import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./Sidebar/Sidebar";

function App() {
  return (
    <Router>
      <SideBar />
      <Routes>
        <Route></Route>
      </Routes>
    </Router>
  );
}
export default App;
