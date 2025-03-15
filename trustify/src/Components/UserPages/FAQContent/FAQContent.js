import React, { useState } from "react";
import axios from "axios"; // Import Axios
import "./FAQContent.css";

const FAQContent = () => {
  const [question, setQuestion] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(""); // Answer

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (question.trim() === "" || additionalInfo.trim() === "") {
      alert("Please fill out both fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/faqs", {
        question,
        answer: additionalInfo, // Match the backend field name
      });

      console.log("Response:", response.data);
      alert("FAQ submitted successfully!");

      // Clear input fields after submission
      setQuestion("");
      setAdditionalInfo("");
    } catch (error) {
      console.error("Error submitting FAQ:", error.response?.data || error.message);
      alert("Failed to submit FAQ.");
    }
  };

  return (
    <div className="faq-container">
      <h2>FAQ PANEL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="faq-input"
          placeholder="Question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <input
          type="text"
          className="faq-input"
          placeholder="Answer..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          required
        />
        <button type="submit" className="faq-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FAQContent;
