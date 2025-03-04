import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./component/Sidebar/Sidebar";
import PeopleAndTerms from "./component/People/PeopleAndTerms";
import DetailsPage from "./component/People/DetailsPage";
import ImportantTermsPage from "./component/People/ImportantTermsPage";

function App() {
  const [darkMode, setDarkMode] = useState(false); // Default: Light mode


  return (
    <Router>
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/teams" element={<PeopleAndTerms darkMode={darkMode} />} />
        <Route path="/people-details" element={<DetailsPage />} />
        <Route path="/terms-details" element={<ImportantTermsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
