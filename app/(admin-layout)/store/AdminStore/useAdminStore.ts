import { create } from "zustand";

type AdminInfo = {
  userName: string;
  id: number | string;
  lastDateLogIn: string;
};

type AdminStore = {
  user: AdminInfo | null;
  setAdmin: (user: AdminInfo) => void;
  clearAdmin: () => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  user: null,

  setAdmin: (user: AdminInfo) => set({ user }),

  clearAdmin: () => set({ user: null }),
}));
