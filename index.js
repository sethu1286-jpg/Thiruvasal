// src/index.js
// React application entry point

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Mount the React app into #root div (defined in public/index.html)
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
