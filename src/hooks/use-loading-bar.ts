'use client';
import { create } from 'zustand';
interface UseLoadingBar {
  initial: boolean;
  progress: number;

  initialLoaded: () => void;
  // return `true` if animation can start else `false`
  start: (url?: string) => boolean;
  finish: () => void;
}

export const useLoadingBar = create<UseLoadingBar>((set) => ({
  progress: 0,
  initial: true,

  initialLoaded() {
    set({ initial: false });
  },

  start(url) {
    const currentUrl = location.pathname + location.search.trim();
    if (url?.startsWith('#')) return false;
    if (currentUrl === url?.trim() || '') return false;
    set({ progress: 90 });
    return true;
  },

  finish() {
    set({ progress: 100 });
  }
}));
