// chat-frontend/src/App.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ChatUI from "./components/ChatUI";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<ProtectedRoute><ChatUI /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;