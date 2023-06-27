import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./workers/serviceWorkerRegister";
import * as Sentry from "@sentry/browser";
import { SENTRY_DSN } from "./config";
import confirm from "./lib/confirm";

// force HTTPS
const { location } = window;
if (!serviceWorker.isLocalhost && location.protocol !== "https:") {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}

// add sentry error tracking
Sentry.init({ dsn: SENTRY_DSN });

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
