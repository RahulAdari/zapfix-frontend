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
  <div style={{ padding: '2rem', backgroundColor: '#fff' }}>
    <h2>Login Screen Loaded ✅</h2>
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleLogin}>Login</button>
  </div>
);
}

export default Login;