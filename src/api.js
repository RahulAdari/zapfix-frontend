import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000", // ✅ not 127.0.0.1
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;