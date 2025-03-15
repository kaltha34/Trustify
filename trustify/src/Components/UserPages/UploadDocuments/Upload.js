import React, { useState, useCallback } from "react";
import "./Upload.css";
import { ArrowLeft, X } from "lucide-react";

const Upload = () => {
  const [filesArray, setFilesArray] = useState([]);
  const [highlight, setHighlight] = useState(false);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setHighlight(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setHighlight(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setHighlight(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => file.type === "application/pdf");
    if (validFiles.length !== files.length) {
      alert("Some files were not valid PDFs and were ignored.");
    }
    const filesWithTimestamp = validFiles.map((file) => ({
      name: file.name,
      timestamp: new Date().toLocaleString(), // Capture the current timestamp
    }));
    setFilesArray((prevFiles) => [...prevFiles, ...filesWithTimestamp]);
  };

  const removeFile = (fileName) => {
    setFilesArray((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
    event.target.value = "";
  };

  return (
    <div className="upload-container">
      <div className="upload-section">
        {" "}
        <div className="uploadheader">
          <ArrowLeft
            size={34}
            onClick={() => window.history.back()}
            className="backbutton"
          />
          <h2>Upload Documents</h2>
        </div>
        <div
          className={`drop-area ${highlight ? "highlight" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileElem").click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === "Enter" && document.getElementById("fileElem").click()
          }
        >
          <p>Drag & drop files here or click to upload</p>
          <input
            type="file"
            id="fileElem"
            multiple
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
          <label className="upload-label">Upload Files</label>
        </div>
        <div className="file-display">
          {filesArray.length === 0 ? (
            <p>No files uploaded</p>
          ) : (
            filesArray.map((file, index) => (
              <div key={index} className="file-item">
                <span>{file.name}</span>
                <span className="upload-time">
                  {" "}
                  Uploaded on: {file.timestamp}
                </span>
                <X
                  fontSize={24}
                  onClick={() => removeFile(file.name)}
                  className="closeicon"
                />
              </div>
            ))
          )}
        </div>
        <button className="upload-button" disabled={filesArray.length === 0}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
