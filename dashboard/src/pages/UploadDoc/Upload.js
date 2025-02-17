import React, { useCallback, useState } from "react";
import "./Upload.css"; // Import the CSS file

const UploadDoc = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("hover"); // Add hover class
  }, []);

  const handleFiles = (files) => {
    const newFiles = [...files].map((file) => ({
      name: file.name,
      time: new Date().toLocaleString(),
    }));
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const uploadFile = (file) => {
    console.log("File uploaded:", file.name);
    // You can add your file upload logic here
  };

  return (
    <div className="Upload-Container">
      <div
        className="UploadDoc-Body"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag and drop files here</p>
        <input
          type="file"
          id="fileElem"
          multiple
          accept="image/*"
          style={{ display: "none" }}
        />
        <label htmlFor="fileElem">or click to select files</label>
      </div>
      <div className="File-Display">
        <h3>Uploaded Files</h3>
        <ul>
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              <span>{file.name}</span> - <span>{file.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadDoc;
