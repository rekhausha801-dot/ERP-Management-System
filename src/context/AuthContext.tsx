import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Company, User } from '../types';

interface AuthContextType {
  user: User | null;
  selectedCompany: Company | null;
  companies: Company[];
  login: (email: string, role?: User['role']) => boolean;
  logout: () => void;
  selectCompany: (companyId: string) => void;
  isAuthenticated: boolean;
}

const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'Apex Global Industries Ltd',
    code: 'AGI',
    registrationNumber: 'REG-2023-8901',
    taxId: 'TAX-US-4829',
    email: 'contact@apexglobal.com',
    phone: '+1 800-456-7890',
    address: '100 Enterprise Blvd, Suite 400, New York, NY',
    status: 'active',
  },
  {
    id: 'comp-2',
    name: 'Vanguard Engineering & Construction',
    code: 'VEC',
    registrationNumber: 'REG-2021-4412',
    taxId: 'TAX-US-1029',
    email: 'ops@vanguardeng.com',
    phone: '+1 800-234-5678',
    address: '45 Tech Valley Road, Austin, TX',
    status: 'active',
  },
  {
    id: 'comp-3',
    name: 'Horizon Logistics & Supply Chain',
    code: 'HLSC',
    registrationNumber: 'REG-2022-7721',
    taxId: 'TAX-US-8831',
    email: 'support@horizonlogistics.com',
    phone: '+1 800-987-6543',
    address: '88 Harbor Way, Seattle, WA',
    status: 'active',
  },
];

const mockDefaultUser: User = {
  id: 'usr-1',
  name: 'Devi Admin',
  email: 'admin@apexglobal.com',
  role: 'superadmin',
  companyId: 'comp-1',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('erp_user');
    return saved ? JSON.parse(saved) : mockDefaultUser;
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem('erp_selected_company');
    return saved ? JSON.parse(saved) : mockCompanies[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('erp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('erp_user');
    }
  }, [user]);

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem('erp_selected_company', JSON.stringify(selectedCompany));
    }
  }, [selectedCompany]);

  const login = (email: string, role: User['role'] = 'superadmin') => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      companyId: selectedCompany?.id || mockCompanies[0].id,
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  const selectCompany = (companyId: string) => {
    const comp = mockCompanies.find((c) => c.id === companyId);
    if (comp) {
      setSelectedCompany(comp);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCompany,
        companies: mockCompanies,
        login,
        logout,
        selectCompany,
        isAuthenticated: !!user,
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
