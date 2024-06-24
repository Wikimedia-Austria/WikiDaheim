window.global ||= window; // fix for react-autocomplete

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./workers/serviceWorkerRegister";
import confirm from "./utils/confirm";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: async () => {
    if (
      await confirm({
        title: "Neue WikiDaheim-Version verfügbar",
        content:
          "Möchtest du die Seite neu laden, um die aktuellste Version zu verwenden?",
        cancelTitle: "Jetzt nicht",
        confirmTitle: "Ja, Seite neu Laden",
      })
    ) {
      window.location.reload();
    }
  },
});
