import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import Home from "./pages/home";
import AboutData from "./pages/about.data";
import TestData from "./pages/test.data";
import TestPage from "./pages/test";
import CachedPage from "./pages/cached";
import ConfigPage from "./pages/config";
import { dataLoader } from "./pages/cached.data";

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
    component: TestPage,
    load: TestData,
  },
  {
    path: "/cached/:id",
    component: CachedPage,
    load: dataLoader,
  },
  {
    path: "/config",
    component: ConfigPage,
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
