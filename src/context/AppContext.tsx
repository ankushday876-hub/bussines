import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, ProductEntry, UserProfile, AdminSettings } from '../types';

interface AppContextType extends AppState {
  addEntry: (entry: Omit<ProductEntry, 'id' | 'date'>) => void;
  togglePremium: () => void;
  loginAdmin: (email: string) => boolean;
  logoutAdmin: () => void;
  clearHistory: () => void;
  updateUserProfile: (profile: UserProfile) => void;
  updateAdminSettings: (settings: AdminSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'simple-business-calc-data';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultState: AppState = {
      entries: [],
      isPremium: false,
      isAdmin: false,
      userProfile: { name: 'Guest User', email: '' },
      adminSettings: { upiId: 'business@upi', premiumPrice: 499 },
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge parsed state with default state to ensure new fields exist
        return {
          ...defaultState,
          ...parsed,
          // Ensure nested objects are also merged if they exist in parsed but might be partial
          userProfile: { ...defaultState.userProfile, ...(parsed.userProfile || {}) },
          adminSettings: { ...defaultState.adminSettings, ...(parsed.adminSettings || {}) },
        };
      } catch (e) {
        console.error('Failed to parse saved state', e);
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addEntry = (entryData: Omit<ProductEntry, 'id' | 'date'>) => {
    const newEntry: ProductEntry = {
      ...entryData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, entries: [newEntry, ...prev.entries] }));
  };

  const togglePremium = () => {
    setState((prev) => ({ ...prev, isPremium: !prev.isPremium }));
  };

  const loginAdmin = (email: string) => {
    if (email === 'ankushday51@gmail.com') {
      setState((prev) => ({ ...prev, isAdmin: true }));
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setState((prev) => ({ ...prev, isAdmin: false }));
  };

  const clearHistory = () => {
    setState((prev) => ({ ...prev, entries: [] }));
  };

  const updateUserProfile = (profile: UserProfile) => {
    setState((prev) => ({ ...prev, userProfile: profile }));
  };

  const updateAdminSettings = (settings: AdminSettings) => {
    setState((prev) => ({ ...prev, adminSettings: settings }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addEntry,
        togglePremium,
        loginAdmin,
        logoutAdmin,
        clearHistory,
        updateUserProfile,
        updateAdminSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
