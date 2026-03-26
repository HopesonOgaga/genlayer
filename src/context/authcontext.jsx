import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);


  // auth system signin signup logout functions will go here
  return (
    <AuthContext.Provider
      value={{ user, setUser, session, setSession }}
    >
      {children}  
    </AuthContext.Provider>
  );
};

export default AuthContext;


// use auth 

export const useAuth = ()=>{
  return useContext(AuthContext);
}