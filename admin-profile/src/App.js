import React, { useState } from "react";
import Sidebar from "./component/Sidebar/Sidebar";
import Profile from "./component/Profile/Profile";
import "./App.css";

function App() {
  const [selectedMenu, setSelectedMenu] = useState("");

  return (
    <div className="app-container">
      <Sidebar setSelectedMenu={setSelectedMenu} />
      <div className="content">
        {selectedMenu === "Profile" && <Profile />}
      </div>
    </div>
  );
}

export default App;
