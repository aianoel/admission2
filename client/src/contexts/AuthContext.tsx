import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@shared/schema';
import { authAPI, storage } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user session
    console.log('AuthContext: Checking for existing user session...');
    const savedUser = storage.getUser();
    console.log('AuthContext: Saved user:', savedUser);
    if (savedUser) {
      // Check if the user name is invalid (undefined undefined) and refresh if needed
      if (!savedUser.name || savedUser.name.includes('undefined') || savedUser.name.trim() === '') {
        console.log('AuthContext: User name is invalid, clearing cache and re-logging...');
        storage.removeUser();
        // Auto-login to get fresh user data
        login("admin@school.edu", "admin123456").catch(error => {
          console.log('AuthContext: Refresh login failed:', error);
          setLoading(false);
        });
        return;
      }
      setUser(savedUser);
      console.log('AuthContext: User loaded from storage');
    } else {
      // Auto-login admin user for development
      console.log('AuthContext: No saved user, attempting auto-login...');
      login("admin@school.edu", "admin123456").catch(error => {
        console.log('AuthContext: Auto-login failed:', error);
        setLoading(false);
      });
      return; // Don't set loading to false here as login will handle it
    }
    setLoading(false);
    console.log('AuthContext: Loading set to false');
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login({ email, password });
      
      // Set user data - this will trigger a re-render and show the dashboard
      setUser(response.user);
      storage.setUser(response.user);
      
      console.log(`User logged in successfully: ${response.user.name} (${response.user.role})`);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    storage.removeUser();
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
