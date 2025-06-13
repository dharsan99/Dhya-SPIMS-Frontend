import { create } from 'zustand';

interface PaginationState {
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  resetPagination: () => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  page: 1,
  rowsPerPage: 10,
  setPage: (page) => set({ page }),
  setRowsPerPage: (rows) => set({ rowsPerPage: rows, page: 1 }), // reset page on change
  resetPagination: () => set({ page: 1, rowsPerPage: 10 }),
}));