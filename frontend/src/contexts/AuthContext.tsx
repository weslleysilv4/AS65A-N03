"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "@/types/api";
import {
  getTokenFromCookie,
  decodeJWTPayload,
  removeTokenFromCookie,
} from "@/utils/auth";
import { EVENTS } from "@/utils/constants";

interface JWTTokenData {
  sub?: string;
  user_id?: string;
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  user_metadata?: {
    name?: string;
    role?: "PUBLISHER" | "ADMIN";
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    removeTokenFromCookie();
    setUser(null);
    window.dispatchEvent(new Event(EVENTS.AUTH_LOGOUT));
    window.location.href = "/login";
  };

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = getTokenFromCookie();

        if (token) {
          try {
            const tokenData = decodeJWTPayload(token) as JWTTokenData;

            if (tokenData) {
              const userData: AuthUser = {
                id: String(
                  tokenData.sub || tokenData.user_id || tokenData.id || ""
                ),
                email: String(tokenData.email || ""),
                name: String(
                  tokenData.user_metadata?.name || tokenData.name || ""
                ),
                role: (tokenData.user_metadata?.role ||
                  tokenData.role ||
                  "PUBLISHER") as "PUBLISHER" | "ADMIN",
                user_metadata: tokenData.user_metadata,
              };

              setUser(userData);
            } else {
              throw new Error("Invalid token format");
            }
          } catch (tokenError) {
            console.error("Error parsing token:", tokenError);
            removeTokenFromCookie();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();

    const handleAuthLogin = (event: CustomEvent) => {
      try {
        if (event.detail?.user) {
          setUser(event.detail.user);
        } else {
          checkAuthState();
        }
      } catch (error) {
        console.error("Error handling auth login event:", error);
        setUser(null);
      }
    };

    const handleAuthLogout = () => {
      try {
        setUser(null);
      } catch (error) {
        console.error("Error handling auth logout event:", error);
      }
    };

    window.addEventListener(
      EVENTS.AUTH_LOGIN,
      handleAuthLogin as EventListener
    );
    window.addEventListener(EVENTS.AUTH_LOGOUT, handleAuthLogout);

    return () => {
      window.removeEventListener(
        EVENTS.AUTH_LOGIN,
        handleAuthLogin as EventListener
      );
      window.removeEventListener(EVENTS.AUTH_LOGOUT, handleAuthLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
