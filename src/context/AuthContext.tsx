import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Company } from '../mocks/companies.mock';
import type { User } from '../mocks/users.mock';
import { SAMPLE_COMPANIES } from '../mocks/companies.mock';
import { MOCK_USERS } from '../mocks/users.mock';
import type { ErpPackageId } from '../config/erpPackageConfig';

interface AuthContextType {
  user: User | null;
  selectedCompany: Company | null;
  companies: Company[];
  login: (email: string, role?: User['role'], companyId?: string) => boolean;
  logout: () => void;
  selectCompany: (companyId: string) => void;
  updateCompanyPackage: (companyId: string, newPackage: ErpPackageId) => void;
  addCompany: (newCompany: Omit<Company, 'id'>) => Company;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('universal_erp_companies_v2');
    return saved ? JSON.parse(saved) : SAMPLE_COMPANIES;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('universal_erp_user_v2');
    return saved ? JSON.parse(saved) : MOCK_USERS[1]; // Default to ABC Traders admin
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(() => {
    const savedId = localStorage.getItem('universal_erp_company_id_v2');
    const found = companies.find((c) => c.id === savedId);
    return found || companies[0] || null;
  });

  useEffect(() => {
    localStorage.setItem('universal_erp_companies_v2', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    if (user) localStorage.setItem('universal_erp_user_v2', JSON.stringify(user));
    else localStorage.removeItem('universal_erp_user_v2');
  }, [user]);

  useEffect(() => {
    if (selectedCompany) localStorage.setItem('universal_erp_company_id_v2', selectedCompany.id);
  }, [selectedCompany]);

  const selectCompany = (companyId: string) => {
    const target = companies.find((c) => c.id === companyId);
    if (target) setSelectedCompany(target);
  };

  const login = (emailOrUsername: string, role: User['role'] = 'company_admin', companyId?: string) => {
    const chosenCompanyId = companyId || selectedCompany?.id || companies[0]?.id;

    // Check if matching mock user exists by email or username
    const normalizedInput = emailOrUsername.trim().toLowerCase();
    const matchedUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === normalizedInput || u.name.toLowerCase().includes(normalizedInput)
    );

    let displayName = 'Janani';
    if (matchedUser) {
      // Use clean proper name
      displayName = matchedUser.name.replace(/\s*\(.*?\)\s*/g, '').trim();
    } else if (emailOrUsername.includes('@')) {
      const prefix = emailOrUsername.split('@')[0];
      displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    } else {
      displayName = emailOrUsername.charAt(0).toUpperCase() + emailOrUsername.slice(1);
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: displayName,
      email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername.toLowerCase()}@universal-erp.io`,
      role,
      companyId: role === 'superadmin' ? undefined : chosenCompanyId,
      status: 'active',
    };
    setUser(newUser);
    if (chosenCompanyId) selectCompany(chosenCompanyId);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('universal_erp_user_v2');
  };

  const updateCompanyPackage = (companyId: string, newPackage: ErpPackageId) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const updated = { ...c, packageType: newPackage };
          if (selectedCompany?.id === companyId) {
            setSelectedCompany(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  const addCompany = (newCompanyData: Omit<Company, 'id'>): Company => {
    const newCompany: Company = {
      ...newCompanyData,
      id: 'comp-' + Date.now(),
    };
    setCompanies((prev) => [...prev, newCompany]);
    return newCompany;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCompany,
        companies,
        login,
        logout,
        selectCompany,
        updateCompanyPackage,
        addCompany,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'superadmin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Graceful fallback to prevent crash during React hot reload or boundary mount
    return {
      user: MOCK_USERS[1],
      selectedCompany: SAMPLE_COMPANIES[0],
      companies: SAMPLE_COMPANIES,
      login: () => true,
      logout: () => {},
      selectCompany: () => {},
      updateCompanyPackage: () => {},
      addCompany: () => SAMPLE_COMPANIES[0],
      isAuthenticated: true,
      isSuperAdmin: false,
    };
  }
  return context;
};
