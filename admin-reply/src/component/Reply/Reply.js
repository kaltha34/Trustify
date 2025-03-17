import React, { useState } from "react";
import "./Reply.css";

const Reply = () => {
  const [replyText, setReplyText] = useState(""); // State to track reply text
  const [error, setError] = useState(false); // State for validation message

  const handleSubmit = () => {
    if (!replyText.trim()) {
      setError(true); // Show error message
      return;
    }

    setError(false); // Hide error if valid
    alert(`Reply Submitted: ${replyText}`); // Show success message
    setReplyText(""); // Clear textarea after submission
  };

  return (
    <div className="reply-container">
      <h2>User Question</h2>
      <textarea className="user-textarea" readOnly></textarea> {/* No changes here */}

      <h2>Reply Section</h2>
      <textarea
        className="reply-textarea"
        placeholder="Write your reply here..."
        value={replyText}
        onChange={(e) => {
          setReplyText(e.target.value);
          setError(false); // Remove error when user types
        }}
      ></textarea>

      {/* Show error message only when user tries to submit an empty reply */}
      {error && <p className="error-message"><b>This field is required</b></p>}

      <button className="reply-button" onClick={handleSubmit}>
        Send Reply
      </button>
    </div>
  );
};

export default Reply;
