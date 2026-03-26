import React from "react";
import { useAuth } from "../context/authcontext";

export default function Signup() {
  const { session, user } = useAuth();

  console.log("SESSION:", session);
  console.log("USER:", user);

  return <section>signup page</section>;
}
  