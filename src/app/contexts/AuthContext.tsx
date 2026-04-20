import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'patient@clinic.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    phone: '+1234567890',
  },
  {
    id: '2',
    email: 'doctor@clinic.com',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
    role: 'doctor',
    phone: '+1234567891',
  },
  {
    id: '3',
    email: 'reception@clinic.com',
    firstName: 'Emily',
    lastName: 'Johnson',
    role: 'receptionist',
    phone: '+1234567892',
  },
  {
    id: '4',
    email: 'admin@clinic.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1234567893',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('clinic_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('clinic_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const loginWithSocial = async (provider: 'google' | 'facebook') => {
    // Mock social login
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: `${provider}user@example.com`,
      firstName: 'Social',
      lastName: 'User',
      role: 'patient',
    };

    setUser(mockUser);
    localStorage.setItem('clinic_user', JSON.stringify(mockUser));
  };

  const signup = async (data: SignupData) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phone: data.phone,
    };

    setUser(newUser);
    localStorage.setItem('clinic_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinic_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithSocial,
        logout,
        signup,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
