import React, { useState } from "react";
import Sidebar from "./component/Sidebar/Sidebar";
import FAQContent from "./component/FAQContent/FAQContent"; // Import FAQ component
import "./App.css";

function App() {
  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <div className="app-container">
      <Sidebar setSelectedMenu={setSelectedMenu} />
      <div className="content">
        {selectedMenu === "FAQ" && <FAQContent />}
      </div>
    </div>
  );
}

export default App;
