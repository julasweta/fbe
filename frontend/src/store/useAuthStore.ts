import { create } from "zustand";
import type { IUser } from "../interfaces/IUser";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: IUser | null;
  login: (accessToken: string, refreshToken: string, user: IUser) => void;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

// Відновлення user з localStorage (якщо є)
const storedUser = localStorage.getItem("user");
const parsedUser: IUser | null = storedUser ? JSON.parse(storedUser) : null;

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: parsedUser,

  login: (accessToken, refreshToken, user) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken, refreshToken, user });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ accessToken, refreshToken });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
