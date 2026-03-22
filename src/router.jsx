import React from "react";
import { createBrowserRouter } from "react-router";
import Home from "./pages/index.jsx";
import Database from "./constant/database";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Database />,
  },
]);

