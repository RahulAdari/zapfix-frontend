import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import "../ChatUI.css";

import logo from "../assets/logo.png"; 
import { API_BASE_URL } from "../config";
import axios from "axios";

function ChatUI() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(false);
  const [dots, setDots] = useState("");

  const token = localStorage.getItem("zapfix_token");
  const email = localStorage.getItem("zapfix_email");
  const userInitial = email ? email.charAt(0).toUpperCase() : "U";

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id);
    }
  }, [selectedSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typewriterText]);

  useEffect(() => {
    if (isDiagnosticsRunning) {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === "...") return "";
          if (prev === "..") return "...";
          if (prev === ".") return "..";
          return ".";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isDiagnosticsRunning]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/sessions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      setSessions(data.sessions || []);
      if (data.sessions.length > 0) {
        setSelectedSession(data.sessions[0]);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/session_messages/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      const formatted = data.messages.flatMap((m) => [
        { sender: "user", content: m.question },
        { sender: "zapfix", content: m.answer },
      ]);
      setMessages(formatted);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const typewriterEffect = async (text) => {
    setThinking(true);
    setTypewriterText("");
    let i = 0;
    while (i < text.length) {
      const delay = text[i] === "." || text[i] === "," ? 100 : 18;
      await new Promise((res) => setTimeout(res, delay));
      setTypewriterText((prev) => prev + text[i]);
      i++;
    }
    setThinking(false);
    setMessages((prev) => [...prev, { sender: "zapfix", content: text }]);
    setTypewriterText("");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    let sessionId = selectedSession?.id;

    if (!selectedSession) {
      try {
        const res = await fetch(`${API_BASE_URL}/user/create_session`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email }),
        });
        const data = await res.json();
        const newSession = { id: data.session_id, title: "Untitled" };
        setSessions((prev) => [newSession, ...prev]);
        setSelectedSession(newSession);
        sessionId = data.session_id;
      } catch (err) {
        console.error("Failed to create session:", err);
        return;
      }
    }

    const body = { session_id: sessionId, message: input };
    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/user/send_message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      typewriterEffect(data.response);
    } catch (err) {
      console.error("Failed to send message:", err);
      setThinking(false);
    }
  };

  const handleRunDiagnostics = async () => {
    try {
      setIsDiagnosticsRunning(true);  // (optional: show "Running..." animation)
      const token = localStorage.getItem("zapfix_token");
      const res = await fetch(`${API_BASE_URL}/agent/run_diagnostics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agent_id: "b40cfd82-0257-4c36-be3a-a1bc3e950868" // <-- your machine's agent ID
        }),
      });
  
      if (res.ok) {
        console.log("🩺 Diagnostics job created successfully!");
      } else {
        console.error("Diagnostics job creation failed:", await res.text());
      }
      setIsDiagnosticsRunning(false);
    } catch (error) {
      console.error("Diagnostics error:", error);
      setIsDiagnosticsRunning(false);
    }
  };    
  
  const handleNewChat = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/create_session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const newSession = { id: data.session_id, title: "Untitled" };
      setSessions((prev) => [newSession, ...prev]);
      setSelectedSession(newSession);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="chat-ui-container">
      <div className="sidebar">
        <div className="sidebar-logo-wrapper">
          <img src={logo} alt="Zapfix" className="zapfix-sidebar-logo" />
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>+ New Chat</button>

        <div className="session-list">
          {sessions.map((s) => (
            <button
              key={s.id}
              className={`session-btn ${selectedSession?.id === s.id ? "selected" : ""}`}
              onClick={() => { setSelectedSession(s); fetchMessages(s.id); }}
            >
              {s.title || "Untitled"}
            </button>
          ))}
        </div>

        <div className="diagnostics-section">
          <h4>🩺 Run Diagnostics</h4>
          <p>Check device health & generate report</p>
          <button onClick={handleRunDiagnostics}>
            Run Now
          </button>
        </div>

        <div className="knowledge-base">
          <div className="kb-title">Knowledge Base</div>
          <ul className="kb-links">
            <li>How to speed up Wi-Fi</li>
            <li>Clear DNS cache manually</li>
          </ul>
        </div>
      </div>

      <div className="main-area">
        <div className="chat-header">
          <h2>Your AI IT Guy</h2>
          <div className="profile-wrapper">
            <div className="user-avatar" onClick={() => setShowDropdown(!showDropdown)}>
              {userInitial}
            </div>
            {showDropdown && (
              <div className="logout-dropdown" onClick={handleLogout}>
                Logout
              </div>
            )}
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.sender === "user" ? "user-msg" : "zapfix-msg"}`}>
              <div className={`message-bubble ${msg.sender === "zapfix" ? "glass" : ""}`}>
                <div className="sender">{msg.sender === "user" ? "You" : "Zapfix"}</div>
                <ReactMarkdown>
  {typeof msg.content === "string" ? msg.content : ""}
</ReactMarkdown>
              </div>
            </div>
          ))}

          {thinking && (
            <div className="message-row zapfix-msg">
              <div className="message-bubble glass">
                <div className="sender">Zapfix</div>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-bar">
          <button className="attach-btn"><FaPaperclip /></button>
          <input
            className="chat-input"
            placeholder="Type your issue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="send-btn" onClick={sendMessage}><FaPaperPlane /></button>
        </div>
      </div>
    </div>
  );
}

export default ChatUI;