import { createContext, useState, useContext } from "react";
import { useEffect } from "react";

import { supabase } from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // session state to store the session data of the user
  const [session, setSession] = useState(null);

  // check if user is logged in or not and set the session data accordingly
  // use (get session method )

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.log("Error getting session data:", error);
      } else {
        setSession(data.session);
        setUser(data.session?.user || null);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth change:", event);

        setSession(session);
        setUser(session?.user ?? null);
      },
    );

    //(2) listen for changes in auth states
    useEffect(() => {
      const { data: listener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          console.log("auth state changed:", event);
          console.log("session:", session);
        },
      );

     
      return () => {
        listener.subscription.unsubscribe();
      };
    }, []);

    // (3) set the session data in the state from supabase auth state changes

    return () => {
      listener.subscription.unsubscribe();
    };
  });

  // auth system signin signup logout functions will go here
  return (
    <AuthContext.Provider value={{ user, setUser, session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// use auth

export const useAuth = () => {
  return useContext(AuthContext);
};
