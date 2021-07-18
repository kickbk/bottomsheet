import create from "zustand";

type State = {
  alert: any;
  setAlert: (alert: any) => void;

  openFilters: boolean;
  setOpenFilters: (openFilters: boolean) => void;

  runningSearch: boolean;
  setRunningSearch: (runningSearch: boolean) => void;
};

export const useStore = create<State>((set) => ({
  alert: null,
  setAlert: (alert) => set(() => ({ alert })),

  openFilters: false,
  setOpenFilters: (openFilters) => set(() => ({ openFilters })),

  runningSearch: false,
  setRunningSearch: (runningSearch) => set(() => ({ runningSearch })),
}));
