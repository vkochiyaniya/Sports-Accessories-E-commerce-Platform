import React, { createContext, useEffect, useState } from "react";
import { useUser, useSignIn, useSignOut } from "@clerk/clerk-react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useSignOut();
  const { signIn, setActive } = useSignIn();
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const { createdSessionId } = await signIn.create({
        identifier: email,
        password,
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
