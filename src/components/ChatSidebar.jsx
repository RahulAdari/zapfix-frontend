import React, { useState } from "react";
import "./ChatSidebar.css";

const ChatSidebar = ({
  sessions,
  onNewChat,
  onSessionSelect,
  currentSession,
  onRenameSession,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleRenameClick = (id, currentTitle) => {
    setEditingId(id);
    setEditedTitle(currentTitle);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleRenameSubmit = (id) => {
    if (editedTitle.trim()) {
      onRenameSession(id, editedTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      handleRenameSubmit(id);
    }
  };

  return (
    <div className="sidebar-wrapper">
      {/* Logo + Brand */}
      <div className="sidebar-top">
        <div className="logo-section">
          <div className="zapfix-logo-circle">Z</div>
          <div className="zapfix-name">Zapfix</div>
        </div>

        {/* New Chat */}
        <div className="new-chat-icon" title="New Chat" onClick={onNewChat}>
          ＋
        </div>
      </div>

      {/* Session History */}
      <div className="chat-history">
        {Object.entries(sessions).map(([id, session]) => (
          <div
            key={id}
            className={`chat-session ${id === currentSession ? "active" : ""}`}
            onClick={() => onSessionSelect(id)}
          >
            {editingId === id ? (
              <input
                type="text"
                className="edit-title-input"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={() => handleRenameSubmit(id)}
                onKeyDown={(e) => handleKeyPress(e, id)}
                autoFocus
              />
            ) : (
              <div className="session-title-wrapper">
                <span className="session-title">{session.title || "Untitled"}</span>
                <span
                  className="edit-icon"
                  title="Rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameClick(id, session.title || "Untitled");
                  }}
                >
                  ✏️
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;