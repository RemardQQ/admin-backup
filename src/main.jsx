import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/poppins";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
