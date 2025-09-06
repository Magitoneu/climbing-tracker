// src/storage/simpleStore.ts
import { Platform } from 'react-native';

// Use AsyncStorage for native, localStorage for web
let storage: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

if (Platform.OS === 'web') {
  storage = {
    getItem: async (key) => {
      try { return Promise.resolve(window.localStorage.getItem(key)); } catch { return null; }
    },
    setItem: async (key, value) => {
      try { window.localStorage.setItem(key, value); } catch {}
    },
    removeItem: async (key) => {
      try { window.localStorage.removeItem(key); } catch {}
    },
  };
} else {
  // @ts-ignore
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  storage = {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem,
  };
}

export default storage;
