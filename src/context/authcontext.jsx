import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Get current session on load
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.log("Error getting session:", error.message);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }

      setLoading(false);
    };

    getSession();

    // 🔹 Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth change:", event);

        setSession(session);
        setUser(session?.user ?? null);
      },
    );

    // 🔹 Cleanup
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔐 SIGN UP
  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  // 🔑 LOGIN
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  // 🚪 LOGOUT
  const  signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error.message);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// 🔹 Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
