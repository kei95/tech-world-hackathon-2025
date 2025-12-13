import { create } from 'zustand';
import type { Patient, FlagLevel } from '../types';

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Active menu
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;

  // Patient filter
  filterStatus: 'all' | FlagLevel;
  setFilterStatus: (status: 'all' | FlagLevel) => void;

  // Selected patient
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  activeMenuItem: 'dashboard',
  setActiveMenuItem: (item) => set({ activeMenuItem: item }),

  filterStatus: 'all',
  setFilterStatus: (status) => set({ filterStatus: status }),

  selectedPatient: null,
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
}));
