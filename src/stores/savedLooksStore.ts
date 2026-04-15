import { create } from 'zustand';
import { RecommendedItem, StyleProfile } from '@/types';

// ==========================================
// TYPES
// ==========================================

export interface SavedLook {
  id: string;
  name: string;
  occasion: string;
  items: RecommendedItem[];
  styleProfile: StyleProfile;
  source: {
    type: 'playlist' | 'artist' | 'track' | 'generated';
    name: string;
    imageUrl?: string;
  };
  savedAt: number;
  collectionId?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverColor: string;
  createdAt: number;
}

// ==========================================
// STORAGE HELPERS
// ==========================================

const LOOKS_STORAGE_KEY = 'soundstyle-saved-looks';
const COLLECTIONS_STORAGE_KEY = 'soundstyle-collections';

const COVER_COLORS = [
  '#c4a882',
  '#8b6f5c',
  '#d4a574',
  '#a0785a',
  '#c9b896',
  '#7a5d4a',
  '#b89b7a',
  '#6b4f3d',
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function loadLooks(): SavedLook[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOOKS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLooks(looks: SavedLook[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOOKS_STORAGE_KEY, JSON.stringify(looks));
  } catch (e) {
    console.error('Failed to save looks to localStorage:', e);
  }
}

function loadCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCollections(collections: Collection[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
  } catch (e) {
    console.error('Failed to save collections to localStorage:', e);
  }
}

// ==========================================
// STORE INTERFACE
// ==========================================

interface SavedLooksStore {
  // State
  looks: SavedLook[];
  collections: Collection[];
  isInitialized: boolean;

  // Look actions
  saveLook: (look: Omit<SavedLook, 'id' | 'savedAt'>) => string;
  removeLook: (id: string) => void;
  updateLook: (id: string, updates: Partial<SavedLook>) => void;

  // Collection actions
  createCollection: (name: string, description?: string) => string;
  removeCollection: (id: string) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;

  // Look-Collection binding
  addLookToCollection: (lookId: string, collectionId: string) => void;
  removeLookFromCollection: (lookId: string) => void;
  getLooksInCollection: (collectionId: string) => SavedLook[];

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;

  // Utility
  getLookById: (id: string) => SavedLook | undefined;
  getCollectionById: (id: string) => Collection | undefined;
  clearAll: () => void;
}

// ==========================================
// STORE
// ==========================================

export const useSavedLooksStore = create<SavedLooksStore>((set, get) => ({
  // Initial state
  looks: [],
  collections: [],
  isInitialized: false,

  // ========== LOOK ACTIONS ==========

  saveLook: (look) => {
    const id = generateId();
    const newLook: SavedLook = {
      ...look,
      id,
      savedAt: Date.now(),
    };

    set((state) => {
      const looks = [newLook, ...state.looks];
      saveLooks(looks);
      return { looks };
    });

    return id;
  },

  removeLook: (id) => {
    set((state) => {
      const looks = state.looks.filter((l) => l.id !== id);
      saveLooks(looks);
      return { looks };
    });
  },

  updateLook: (id, updates) => {
    set((state) => {
      const looks = state.looks.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      );
      saveLooks(looks);
      return { looks };
    });
  },

  // ========== COLLECTION ACTIONS ==========

  createCollection: (name, description = '') => {
    const id = generateId();
    const colorIndex = Math.floor(Math.random() * COVER_COLORS.length);

    const newCollection: Collection = {
      id,
      name,
      description,
      coverColor: COVER_COLORS[colorIndex],
      createdAt: Date.now(),
    };

    set((state) => {
      const collections = [newCollection, ...state.collections];
      saveCollections(collections);
      return { collections };
    });

    return id;
  },

  removeCollection: (id) => {
    set((state) => {
      // Remove collection
      const collections = state.collections.filter((c) => c.id !== id);
      saveCollections(collections);

      // Unbind looks from deleted collection
      const looks = state.looks.map((l) =>
        l.collectionId === id ? { ...l, collectionId: undefined } : l
      );
      saveLooks(looks);

      return { collections, looks };
    });
  },

  updateCollection: (id, updates) => {
    set((state) => {
      const collections = state.collections.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      saveCollections(collections);
      return { collections };
    });
  },

  // ========== LOOK-COLLECTION BINDING ==========

  addLookToCollection: (lookId, collectionId) => {
    set((state) => {
      const looks = state.looks.map((l) =>
        l.id === lookId ? { ...l, collectionId } : l
      );
      saveLooks(looks);
      return { looks };
    });
  },

  removeLookFromCollection: (lookId) => {
    set((state) => {
      const looks = state.looks.map((l) =>
        l.id === lookId ? { ...l, collectionId: undefined } : l
      );
      saveLooks(looks);
      return { looks };
    });
  },

  getLooksInCollection: (collectionId) => {
    return get().looks.filter((l) => l.collectionId === collectionId);
  },

  // ========== PERSISTENCE ==========

  loadFromStorage: () => {
    const looks = loadLooks();
    const collections = loadCollections();
    set({ looks, collections, isInitialized: true });
  },

  saveToStorage: () => {
    const { looks, collections } = get();
    saveLooks(looks);
    saveCollections(collections);
  },

  // ========== UTILITY ==========

  getLookById: (id) => {
    return get().looks.find((l) => l.id === id);
  },

  getCollectionById: (id) => {
    return get().collections.find((c) => c.id === id);
  },

  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOOKS_STORAGE_KEY);
      localStorage.removeItem(COLLECTIONS_STORAGE_KEY);
    }
    set({ looks: [], collections: [], isInitialized: true });
  },
}));

// Auto-load on store creation (client-side only)
if (typeof window !== 'undefined') {
  useSavedLooksStore.getState().loadFromStorage();
}
