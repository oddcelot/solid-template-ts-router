/* @refresh reload */
import "./index.css";
import "./pages/style.css";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import App from "./app";
import { routes } from "./routes";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

function start() {
  render(
    () => (
      <Router root={App} singleFlight={true}>
        {routes}
      </Router>
    ),
    root
  );
}

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");

  worker
    .start({
      onUnhandledRequest(req, print) {},
    })
    .then(() => {
      start();
    });
} else {
  start();
}
