import React from "react";
import ReactDOM from "react-dom/client";
import "./storageShim.js";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <App />
    </div>
  </React.StrictMode>
);
