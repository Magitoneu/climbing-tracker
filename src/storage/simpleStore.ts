// src/storage/simpleStore.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use AsyncStorage for native, localStorage for web
let storage: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

if (Platform.OS === 'web') {
  storage = {
    getItem: async key => {
      try {
        return Promise.resolve(window.localStorage.getItem(key));
      } catch {
        // Intentionally silencing localStorage errors (e.g., quota exceeded, privacy mode)
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Intentionally silencing localStorage errors (e.g., quota exceeded, privacy mode)
      }
    },
    removeItem: async key => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Intentionally silencing localStorage errors
      }
    },
  };
} else {
  storage = {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem,
  };
}

export default storage;
