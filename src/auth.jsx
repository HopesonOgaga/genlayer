import { createContext } from "react";
import { useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const [session, setSession] = useState(null);

  return (
    <AuthContext.Provider
      value={{ user, setUser, session, setSession }}
    ></AuthContext.Provider>
  );
};

// sign in sign out function signIn

// sign out function signOut

// session management getssession
