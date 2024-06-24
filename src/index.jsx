window.global ||= window; // fix for react-autocomplete

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// force HTTPS
const { location } = window;
if (!serviceWorker.isLocalhost && location.protocol !== "https:") {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
