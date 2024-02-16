/* @refresh reload */
import "./index.css";

import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import App from "./app";
import { routes } from "./routes";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router root={App} singleFlight={true}>
      {routes}
    </Router>
  ),
  root,
);
