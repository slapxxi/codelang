import { create } from 'zustand';

type NavbarStore = {
  open: boolean;
  toggle: () => void;
};

export const useNavbar = create<NavbarStore>((set) => {
  return {
    open: false,
    toggle() {
      set((s) => ({
        open: !s.open,
      }));
    },
  };
});
