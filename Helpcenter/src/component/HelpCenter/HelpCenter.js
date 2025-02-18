import React, { useState } from "react";
import "./HelpCenter.css";

const HelpCenter = () => {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if email and problem are filled and email is valid
    if (!email || !problem) {
      setFormError("Both email and problem description are required.");
    } else if (!validateEmail(email)) {
      setFormError("Please enter a valid email.");
    } else {
      setFormError("");
      // Proceed with form submission logic (e.g., sending data to backend)
      alert("Problem submitted successfully!");
    }
  };

  const validateEmail = (email) => {
    // Basic email validation (you can adjust the regex as needed)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleFAQClick = (faqText) => {
    setProblem(faqText); // Sets the FAQ text in the problem section
  };

  return (
    <div className="help-center">
      <div className="help-center-header">
        <h1>Help Center</h1>
      </div>
      <div className="help-content">
        <form onSubmit={handleSubmit}>
          <div className="form-section email-section">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-section problem-section">
            <label htmlFor="problem">Problem Section :</label>
            <textarea
              id="problem"
              placeholder="Describe your problem..."
              rows="4"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
            ></textarea>
          </div>
          {formError && <p className="error-message">{formError}</p>}
          <div className="faq-section">
            <ul>
              <li onClick={() => handleFAQClick("How can I reset my password?")}>
                How can I reset my password?
              </li>
              <li onClick={() => handleFAQClick("How do I update my profile information?")}>
                How do I update my profile information?
              </li>
              <li onClick={() => handleFAQClick("How can I check my verification status?")}>
                How can I check my verification status?
              </li>
            </ul>
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpCenter;
