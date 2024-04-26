"use client";

import { createContext, ReactNode, useContext } from "react";
import type { User } from "@/types";
import { actionWrapper, getAuthUser, signOut } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthContext {
  user: User | null;
  setUser: (user: User | null | undefined) => void;
  logout: (redirect?: string) => void;
  refetchUser: () => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {
    throw new Error("setUser must be defined");
  },
  logout: () => {
    throw new Error("logout must be defined");
  },
  refetchUser: () => {
    throw new Error("refetchUser must be defined");
  },
});

interface AuthProviderProps {
  children: ReactNode;
  user: User | null;
}

export const AuthProvider = ({ user, children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const { replace, refresh } = useRouter();

  const { data: _user } = useQuery({
    queryKey: ["authUser"],
    initialData: user,
    staleTime: 15_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    queryFn: () => actionWrapper(getAuthUser()),
  });

  function refetchUser() {
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
  }

  function setAuthUser(user?: User | null) {
    queryClient.setQueriesData(
      {
        queryKey: ["authUser"],
      },
      user,
    );
  }

  async function logout(redirect?: string) {
    try {
      await actionWrapper(signOut());
      queryClient.setQueriesData(
        {
          queryKey: ["authUser"],
        },
        null,
      );
      if (redirect) {
        replace(redirect);
        refresh();
      }
    } catch (errors) {
      console.error(errors);
      toast.error("Failed to sign out, please try again.");
    }
  }

  return (
    <AuthContext.Provider
      value={{ user: _user, setUser: setAuthUser, logout, refetchUser }}
    >
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
