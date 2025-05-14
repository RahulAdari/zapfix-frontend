// chat-frontend/src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ChatUI from "./components/ChatUI";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><ChatUI /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;