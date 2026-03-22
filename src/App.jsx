import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthContextProvider } from "./auth.js";

export default function App() {
  return ( 
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}
