import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import "./HelpCenter.css";

const HelpCenter = () => {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [formError, setFormError] = useState("");
  const [faqs, setFaqs] = useState([]); // State for FAQs

  // Fetch FAQs when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/faqs") // API endpoint for FAQs
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setFaqs(response.data); // Set FAQs data
        }
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !problem) {
      setFormError("Both email and problem description are required.");
    } else if (!validateEmail(email)) {
      setFormError("Please enter a valid email.");
    } else {
      setFormError("");
      // Call the backend API to submit the problem
      axios
        .post("http://localhost:5000/api/tickets", {
          userEmail: email,
          issue: problem,
        })
        .then((response) => {
          alert("Problem submitted successfully!");
          // Reset the form after submission
          setEmail("");
          setProblem("");
        })
        .catch((error) => {
          console.error("Error submitting ticket:", error);
          alert("There was an error submitting your ticket.");
        });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleFAQClick = (faqText) => {
    setProblem(faqText); // Pre-fills the problem description with the clicked FAQ
  };

  return (
    <div className="help-center">
      <div className="help-center-header">
        <h1>Help Center</h1>
      </div>
      <div className="help-content">
        <form onSubmit={handleSubmit}>
          {/* Gray Container for Email and Problem Section */}
          <div className="gray-container">
            <div className="form-section email-section">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="helpcenteremail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-section problem-section">
              <label htmlFor="problem">Describe your problem:</label>
              <textarea
                id="problem"
                placeholder="Describe your problem..."
                rows="4"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          {formError && <p className="error-message">{formError}</p>}

          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            <ul>
              {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <li
                    key={index}
                    style={{ padding: "18px 25px" }}
                    onClick={() => handleFAQClick(faq.question)}
                  >
                    {faq.question}
                  </li>
                ))
              ) : (
                <li cstyle={{ padding: "10px 15px" }}>Loading FAQs...</li>
              )}
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
