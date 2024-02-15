import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import Home from "./pages/home";
import AboutData from "./pages/about.data";
import TestData from "./pages/test.data";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: lazy(() => import("./pages/about")),
    load: AboutData,
  },
  {
    path: "/test/:id",
    component: lazy(() => import("./pages/test")),
    load: TestData,
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
