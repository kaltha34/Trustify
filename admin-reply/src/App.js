import React, { useState } from "react";
import Sidebar from "./component/Sidebar/Sidebar";
import Reply from "./component/Reply/Reply";
import "./App.css";

function App() {
  const [selectedMenu, setSelectedMenu] = useState("");

  return (
    <div className="app-container">
      <Sidebar setSelectedMenu={setSelectedMenu} />
      <div className="content">
        {selectedMenu === "Reply" && <Reply />}
      </div>
    </div>
  );
}

export default App;
