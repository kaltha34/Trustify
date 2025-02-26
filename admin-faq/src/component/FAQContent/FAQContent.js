import React, { useState } from "react";
import "./FAQContent.css";

const FAQContent = () => {
  const [question, setQuestion] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(""); // New state for second input field

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() === "" || additionalInfo.trim() === "") {
      alert("Please fill out both fields.");
    } else {
      console.log("Submitted Question:", question);
      console.log("Additional Information:", additionalInfo);
      setQuestion(""); // Clear input fields after submission
      setAdditionalInfo("");
    }
  };

  return (
    <div className="faq-container">
      <h2>FAQ PANEL</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="faq-input"
            placeholder="Question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            className="faq-input"
            placeholder="Answer..."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="faq-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FAQContent;
