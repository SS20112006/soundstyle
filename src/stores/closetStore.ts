import { create } from 'zustand';
import { ClosetItem, StyleProfile, RecommendedItem } from '@/types';

interface ClosetStore {
  // Closet items
  items: ClosetItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: ClosetItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ClosetItem>) => void;
  clearCloset: () => void;
  
  // Filter & sort
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  
  // Style matching
  matchedItems: { item: ClosetItem; score: number; reason: string }[];
  setMatchedItems: (items: { item: ClosetItem; score: number; reason: string }[]) => void;
}

export const useClosetStore = create<ClosetStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  filterCategory: null,
  matchedItems: [],
  
  addItem: (item) => set((state) => ({
    items: [item, ...state.items],
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, ...updates } : i),
  })),
  
  clearCloset: () => set({ items: [], matchedItems: [] }),
  
  setFilterCategory: (category) => set({ filterCategory: category }),
  
  setMatchedItems: (items) => set({ matchedItems: items }),
}));

// ==========================================
// RECOMMENDATIONS STORE
// ==========================================

interface RecommendationsStore {
  // Current style profile
  styleProfile: StyleProfile | null;
  setStyleProfile: (profile: StyleProfile | null) => void;
  
  // Generated outfits
  outfits: {
    name: string;
    occasion: string;
    items: RecommendedItem[];
  }[];
  setOutfits: (outfits: RecommendationsStore['outfits']) => void;
  
  // Selected outfit
  selectedOutfitIndex: number | null;
  setSelectedOutfitIndex: (index: number | null) => void;
  
  // Budget preference
  budget: 'low' | 'mid' | 'high';
  setBudget: (budget: 'low' | 'mid' | 'high') => void;
  
  // Occasion filter
  occasion: string | null;
  setOccasion: (occasion: string | null) => void;
  
  // Loading
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export const useRecommendationsStore = create<RecommendationsStore>((set) => ({
  styleProfile: null,
  outfits: [],
  selectedOutfitIndex: null,
  budget: 'mid',
  occasion: null,
  isGenerating: false,
  
  setStyleProfile: (profile) => set({ styleProfile: profile }),
  setOutfits: (outfits) => set({ outfits }),
  setSelectedOutfitIndex: (index) => set({ selectedOutfitIndex: index }),
  setBudget: (budget) => set({ budget }),
  setOccasion: (occasion) => set({ occasion }),
  setIsGenerating: (loading) => set({ isGenerating: loading }),
}));
