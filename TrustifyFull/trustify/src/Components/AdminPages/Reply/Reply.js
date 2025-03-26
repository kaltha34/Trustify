import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reply.css";

const API_BASE_URL = "http://localhost:5000/api/tickets"; // Update if needed

const Reply = () => {
  const [question, setQuestion] = useState(""); // Stores the question
  const [ticketId, setTicketId] = useState(null); // Stores the ticket ID
  const [replyText, setReplyText] = useState(""); // Tracks reply text
  const [error, setError] = useState(false); // Error validation

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/latest`);
      setQuestion(response.data.question);
      setTicketId(response.data.ticketId);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuestion(); // Load latest question when the page loads
  }, []);

  const handleSubmit = async () => {
    if (!replyText.trim()) {
      setError(true);
      return;
    }

    try {
      if (ticketId) {
        await axios.post(`${API_BASE_URL}/reply/${ticketId}`, { reply: replyText });
      }

      alert("Reply Submitted Successfully!");
      setReplyText(""); // Clear reply field
      setError(false);
      
      // Fetch next question
      fetchQuestion();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <div className="reply-container">
      <h2>User Question</h2>
      <textarea className="user-textarea" readOnly value={question}></textarea>

      <h2>Reply Section</h2>
      <textarea
        className="reply-textarea"
        placeholder="Write your reply here..."
        value={replyText}
        onChange={(e) => {
          setReplyText(e.target.value);
          setError(false);
        }}
        disabled={question === "No questions available"}
      ></textarea>

      {error && <p className="error-message"><b>This field is required</b></p>}

      <button 
        className="reply-button" 
        onClick={handleSubmit}
        disabled={question === "No questions available"} // Disable button if no question
      >
        Send Reply
      </button>
    </div>
  );
};

export default Reply;
