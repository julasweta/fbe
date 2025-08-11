import { create } from "zustand";
import type { IUser } from "../interfaces/IUser";

interface UserState {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  updateUserInStore: (user: IUser) => void;
  removeUser: (id: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],

  setUsers: (users) => set({ users }),

  updateUserInStore: (updatedUser) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      ),
    })),

  removeUser: (id:number) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}));
