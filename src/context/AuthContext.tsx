import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserAccount } from '../types';
import { DEMO_ACCOUNTS } from '../data/mockData';

interface AuthContextType {
  currentRole: UserRole;
  currentAccount: UserAccount;
  switchRole: (role: UserRole) => void;
  updateAccount: (updates: Partial<UserAccount>) => void;
  isRoleSwitchModalOpen: boolean;
  setIsRoleSwitchModalOpen: (open: boolean) => void;
  allDemoAccounts: Record<UserRole, UserAccount>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('gasterus_active_role') as UserRole | null;
    return saved && ['mahasiswa', 'umkm', 'admin'].includes(saved) ? saved : 'mahasiswa';
  });

  const [accounts, setAccounts] = useState<Record<UserRole, UserAccount>>(() => {
    const saved = localStorage.getItem('gasterus_accounts');
    return saved ? JSON.parse(saved) : DEMO_ACCOUNTS;
  });

  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('gasterus_active_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('gasterus_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const updateAccount = (updates: Partial<UserAccount>) => {
    setAccounts((prev) => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        ...updates,
      },
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        currentAccount: accounts[currentRole] || DEMO_ACCOUNTS[currentRole],
        switchRole,
        updateAccount,
        isRoleSwitchModalOpen,
        setIsRoleSwitchModalOpen,
        allDemoAccounts: accounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
