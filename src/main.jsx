import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

// Marque la page comme animable : sans JS, le CSS laisse tout visible.
document.documentElement.classList.add("has-js");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
