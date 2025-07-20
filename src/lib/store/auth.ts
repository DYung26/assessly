import { create } from "zustand";
import { queryClient } from "../queryClient";

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>((set) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return {
    user: null,
    accessToken: token,
    loading: true,
    login: (user, accessToken) => {
      localStorage.setItem("accessToken", accessToken);
      set({ user, accessToken });
      queryClient.setQueryData(["me"], user);
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      set({ user: null, accessToken: null });
      queryClient.clear();
    },
    setUser: (user) => set({ user }),
  };
});
