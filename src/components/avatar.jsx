import React from "react";

function Avatar() {
  return (
    <div style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "20px",
      animation: "pulse 1.5s infinite"
    }}>
      Z
    </div>
  );
}

export default Avatar;
