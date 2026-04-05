import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Transaction } from '../data/mockData';
import { MockAPI } from '../api/mockApi';

type Role = 'admin' | 'viewer';
type Theme = 'light' | 'dark';

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: 'USD' | 'INR';
  setCurrency: (c: 'USD' | 'INR') => void;
  alertsEnabled: boolean;
  setAlertsEnabled: (val: boolean) => void;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (tx: Transaction) => void;
  notifications: Notification[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
  markNotificationsAsRead: () => void;
  isLoading: boolean;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
  formatCurrency: (val: number) => string;
  profile: { name: string; email: string; tier: string; avatar: string };
  updateProfile: (data: { name: string; email: string; tier: string; avatar: string }) => void;
  activeView: 'dashboard' | 'analytics';
  setActiveView: (view: 'dashboard' | 'analytics') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('admin');
  const [theme, setTheme] = useState<Theme>('light');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [profile, setProfile] = useState({
    name: "Alexander Vance",
    email: "alexander.v@liquid.ai",
    tier: "Elite Tier Investor",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics'>('dashboard');

  // Sync Notifications from LocalStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('liquid_notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  const addNotification = (message: string) => {
    if (!alertsEnabled) return; // Silent if disabled
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(7),
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    const updated = [newNotif, ...notifications].slice(0, 50);
    setNotifications(updated);
    localStorage.setItem('liquid_notifications', JSON.stringify(updated));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('liquid_notifications');
  };

  const markNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('liquid_notifications', JSON.stringify(updated));
  };

  const addTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTx = { ...data, id: Math.random().toString(36).substring(7) };
    setTransactions(prev => [newTx, ...prev]);
    addNotification(`Added transaction: ${data.description}`);
  };

  const editTransaction = (tx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
    addNotification(`Updated transaction: ${tx.description}`);
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (tx) addNotification(`Deleted transaction: ${tx.description}`);
  };

  const formatCurrency = (val: number) => {
    const finalVal = currency === 'INR' ? val * 83.5 : val;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : 'USD',
      minimumFractionDigits: 2
    }).format(finalVal);
  };

  // Initial Load from Persistence & Mock API
  useEffect(() => {
    const initApp = async () => {
      // Restore Theme and Role instantly
      const savedTheme = localStorage.getItem('liquid_theme') as Theme;
      if (savedTheme) setTheme(savedTheme);

      const savedRole = localStorage.getItem('liquid_role') as Role;
      if (savedRole) setRole(savedRole);

      const savedCurrency = localStorage.getItem('liquid_currency') as 'USD' | 'INR';
      if (savedCurrency) setCurrency(savedCurrency);

      const savedAlerts = localStorage.getItem('liquid_alerts');
      if (savedAlerts !== null) setAlertsEnabled(savedAlerts === 'true');

      const savedProfile = localStorage.getItem('liquid_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      // Fetch simulated network data
      const data = await MockAPI.fetchTransactions();
      setTransactions(data);
      setIsLoading(false);
    };
    initApp();
  }, []);

  const updateProfile = (data: { name: string; email: string; tier: string; avatar: string }) => {
    setProfile(data);
    localStorage.setItem('liquid_profile', JSON.stringify(data));
    addNotification("Profile identity updated.");
  };

  // Sync Theme to local storage and document body
  useEffect(() => {
    localStorage.setItem('liquid_theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
      addNotification("Dark interface activated");
    } else {
      document.body.classList.remove('dark');
      addNotification("Light interface activated");
    }
  }, [theme]);

  // Sync Role to local storage
  useEffect(() => {
    localStorage.setItem('liquid_role', role);
    addNotification(`Permission set to: ${role.toUpperCase()}`);
  }, [role]);

  // Sync Currency
  useEffect(() => {
    localStorage.setItem('liquid_currency', currency);
    addNotification(`Global currency adapted to ${currency}`);
  }, [currency]);

  // Sync Alerts
  useEffect(() => {
    localStorage.setItem('liquid_alerts', alertsEnabled.toString());
    // No notif here specifically to avoid recursion issues, or a silent one
  }, [alertsEnabled]);

  // Sync Transactions to fake persistence API when they change
  useEffect(() => {
    if (!isLoading) { // Don't wipe data on mount before load
      MockAPI.saveTransactions(transactions);
    }
  }, [transactions, isLoading]);

  return (
    <AppContext.Provider value={{ 
      role, setRole, theme, setTheme, 
      currency, setCurrency,
      alertsEnabled, setAlertsEnabled,
      transactions, setTransactions, addTransaction, editTransaction, deleteTransaction,
      notifications, addNotification, clearNotifications, markNotificationsAsRead,
      isLoading, isAddModalOpen, setIsAddModalOpen, formatCurrency,
      profile, updateProfile,
      activeView, setActiveView
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
