import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CustomerProfile, Role, KycStatus } from '../types/banking';
import { INITIAL_USER, INITIAL_PROFILE } from '../services/mockData';
import { SandboxAdapters } from '../services/sandboxAdapters';

interface AuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: Role;
  loginStep: 'CREDENTIALS' | 'OTP' | 'AUTHENTICATED';
  pendingLoginIdentifier: string | null;
  login: (identifier: string, password: string) => Promise<{ requireOtp: boolean; message: string }>;
  verifyOtp: (code: string) => Promise<boolean>;
  logout: () => void;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  updateProfile: (updated: Partial<CustomerProfile>) => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('apex_auth_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [profile, setProfile] = useState<CustomerProfile | null>(() => {
    const saved = localStorage.getItem('apex_auth_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [loginStep, setLoginStep] = useState<'CREDENTIALS' | 'OTP' | 'AUTHENTICATED'>('AUTHENTICATED');
  const [pendingLoginIdentifier, setPendingLoginIdentifier] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('apex_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('apex_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('apex_auth_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('apex_auth_profile');
    }
  }, [profile]);

  const login = async (identifier: string, password: string): Promise<{ requireOtp: boolean; message: string }> => {
    // Basic credential validation
    if (!identifier || !password) {
      throw new Error('Please enter your mobile/email and password.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // Trigger MFA OTP requirement
    setPendingLoginIdentifier(identifier);
    setLoginStep('OTP');

    // Simulate SMS dispatch
    await SandboxAdapters.sendOtp(identifier.includes('@') ? identifier : '+91 98765 43210', identifier.includes('@') ? 'EMAIL' : 'SMS');

    return {
      requireOtp: true,
      message: 'MFA challenge dispatched. Enter sandbox OTP: 123456',
    };
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    if (code !== '123456') {
      throw new Error('Invalid OTP code. Please enter 123456 for Sandbox mode.');
    }

    // Authenticate
    setUser(INITIAL_USER);
    setProfile(INITIAL_PROFILE);
    setLoginStep('AUTHENTICATED');
    setPendingLoginIdentifier(null);
    return true;
  };

  const register = async (fullName: string, email: string, phone: string, password: string): Promise<void> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      phoneNumber: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      fullName,
      role: 'CUSTOMER',
      isMfaEnabled: true,
      createdAt: new Date().toISOString(),
    };

    const newProfile: CustomerProfile = {
      id: `prof_${Date.now()}`,
      userId: newUser.id,
      fullName,
      kycStatus: 'NOT_SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setProfile(newProfile);
    setLoginStep('AUTHENTICATED');
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setLoginStep('CREDENTIALS');
  };

  const updateProfile = (updated: Partial<CustomerProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updated });
    }
  };

  const switchRole = (newRole: Role) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user && loginStep === 'AUTHENTICATED',
        isAdmin: user?.role === 'ADMIN',
        role: user?.role || 'CUSTOMER',
        loginStep,
        pendingLoginIdentifier,
        login,
        verifyOtp,
        logout,
        register,
        updateProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
