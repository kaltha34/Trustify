import React, { useCallback, useState } from "react";
import "./Upload.css"; // Import the CSS file

const UploadDoc = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("hover");
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("hover");
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("hover");
  }, []);

  const handleFiles = (files) => {
    const filesArray = Array.from(files);
    const newFiles = filesArray.map((file) => ({
      name: file.name,
      time: new Date().toLocaleString(),
    }));
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <div className="Dashboard-Container">
      <div className="Sidebar">Sidebar Content</div>
      <div className="Main-Content">
        <div className="Card">
          <h2>Card 1</h2>
          <div
            className="UploadDoc-Body"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("fileElem").click()} // Trigger file input on click
          >
            <p>Drag and drop files here</p>
            <input
              type="file"
              id="fileElem"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)} // Handle file selection
            />
            <label htmlFor="fileElem">or click to select files</label>
          </div>
          <div className="File-Display">
            <h3>Uploaded Files</h3>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="Card">
          <h2>Card 2</h2>
          <p>Content for Card 2</p>
        </div>
        <div className="Card">
          <h2>Card 3</h2>
          <p>Content for Card 3</p>
        </div>
      </div>
    </div>
  );
};

export default UploadDoc;
