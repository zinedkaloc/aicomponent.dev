"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@/types";
import { actionWrapper, getAuthUser, signOut } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthContext {
  user: User | null;
  setUser: (user: User | null | undefined) => void;
  logout: (redirect?: string) => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {
    throw new Error("setUser must be defined");
  },
  logout: () => {
    throw new Error("logout must be defined");
  },
});

interface AuthProviderProps {
  children: ReactNode;
  user: User | null;
}

export const AuthProvider = ({ user, children }: AuthProviderProps) => {
  const [_user, setUser] = useState<User | null>(user);
  const { replace } = useRouter();

  function setAuthUser(user?: User | null) {
    // @ts-ignore
    setUser(user);
  }

  useEffect(() => {
    const interval = setInterval(fetchUser, 15_000);
    document.addEventListener("visibilitychange", visibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, []);

  async function fetchUser() {
    const user = await actionWrapper(getAuthUser());
    setUser(user);
  }

  function visibilityChange() {
    if (document.visibilityState === "visible") {
      fetchUser();
    }
  }

  async function logout(redirect?: string) {
    try {
      await actionWrapper(signOut());
      setUser(null);
      if (redirect) replace(redirect);
    } catch (errors) {
      console.error(errors);
      toast.error("Failed to sign out, please try again.");
    }
  }

  return (
    <AuthContext.Provider value={{ user: _user, setUser: setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
