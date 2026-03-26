import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/index";
import Database from "./constant/database";
import Login from "./components/login";
import Signup from "./components/signup";    
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Database />,
  },
  {
    path:"/login",
    element: <Login />
  }
  ,
  {
    path:"/signup",
    element: <Signup />
  }
]);