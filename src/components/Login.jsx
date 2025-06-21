import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./Login.css";
import logo from "../assets/logo.png"; // ✅ used below

function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login/`, {
        email,
        password,
      });

      localStorage.setItem("zapfix_token", res.data.token);
      localStorage.setItem("zapfix_email", email);

      if (email === "admin@example.com") {
        navigate("/chat");
      }
    } catch (err) {
      alert("Login failed. Please check credentials.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Zapfix Logo" className="zapfix-logo" />
        <h1 className="title">Welcome to Zapfix</h1>
        <p className="subtitle">Your AI-Powered IT Assistant</p>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;