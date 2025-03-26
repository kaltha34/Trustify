import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inbox.css";

const API_BASE_URL = "http://localhost:5000/api/notifications?userEmail=";

const Inbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [replyText, setReplyText] = useState("");
  const userEmail = localStorage.getItem("email");
  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          params: {
            userEmail: userEmail,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  const openReplyModal = (notification) => {
    setSelectedNotification(notification);
    setReplyText(notification.reply || "");
    setShowReplyModal(true);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setSelectedNotification(null);
    setReplyText("");
  };

  // Handle reply submission
  const handleReplySubmit = async () => {
    if (!selectedNotification) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/${selectedNotification._id}/reply`,
        {
          reply: replyText,
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === selectedNotification._id
            ? { ...notification, reply: response.data.reply }
            : notification
        )
      );

      closeReplyModal();
    } catch (error) {
      console.error("Error replying to notification:", error);
    }
  };

  const filteredNotifications = notifications.filter((notification) =>
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="Inbox-container">
      <h1 className="header">Inbox</h1>

      <div className="Notification-center">
        <div className="Notification-content">
          <div className="Search-Bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search Notifications"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="Notifications">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div key={notification._id} className="Notification-item">
                  <p className="Notification">{notification.message}</p>

                  {notification.reply && (
                    <p className="Reply-text">Reply: {notification.reply}</p>
                  )}
                  <button
                    className="Reply-button"
                    onClick={() => openReplyModal(notification)}
                  >
                    Reply
                  </button>
                </div>
              ))
            ) : (
              <p className="No-notifications">📩 No notifications found.</p>
            )}
          </div>
        </div>
      </div>

      {showReplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reply to Notification</h2>
            <p>{selectedNotification.message}</p>
            <textarea
              placeholder="Type your reply..."
              className="reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <div className="modal-buttons">
              <button className="close-button" onClick={closeReplyModal}>
                Close
              </button>
              <button className="send-button" onClick={handleReplySubmit}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
