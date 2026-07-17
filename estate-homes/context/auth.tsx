import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  hasSeenOnboarding: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isLoggedIn: false,
  hasSeenOnboarding: false,
  signIn: async () => {},
  signOut: async () => {},
  completeOnboarding: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    async function loadStorage() {
      try {
        const onboardingVal = await AsyncStorage.getItem('HAS_SEEN_ONBOARDING');
        const loginVal = await AsyncStorage.getItem('IS_LOGGED_IN');
        setHasSeenOnboarding(onboardingVal === 'true');
        setIsLoggedIn(loginVal === 'true');
      } catch (e) {
        console.error('Failed to load storage state:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorage();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('HAS_SEEN_ONBOARDING', 'true');
      setHasSeenOnboarding(true);
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
    }
  };

  const signIn = async () => {
    try {
      await AsyncStorage.setItem('IS_LOGGED_IN', 'true');
      setIsLoggedIn(true);
    } catch (e) {
      console.error('Failed to save login state:', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('IS_LOGGED_IN');
      setIsLoggedIn(false);
    } catch (e) {
      console.error('Failed to clear login state:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        hasSeenOnboarding,
        signIn,
        signOut,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
