import React from 'react';
import { LayoutDashboard, WalletCards, LineChart, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
import styles from './layout.module.css';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { setIsAddModalOpen, role, addNotification } = useAppContext();
  const mainNav = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <WalletCards size={20} /> },
    { id: 'insights', label: 'Insights', icon: <LineChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandTitle}>Liquid Intelligence</div>
        <div className={styles.brandSubtitle}>Premium Finance</div>
      </div>

      <nav className={styles.navMenu}>
        {mainNav.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activePage === item.id ? styles.active : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.bottomMenu}>
        <button 
          className={styles.newTxBtn}
          onClick={() => {
            if (role === 'admin') {
              setActivePage('transactions');
              setIsAddModalOpen(true);
            } else {
              addNotification("Admin privileges required to add transactions.");
            }
          }}
        >
          <Plus size={20} />
          <span>New Transaction</span>
        </button>
        <button className={styles.navItem} onClick={() => addNotification("Help center is currently offline. Contact system admin.")}>
          <HelpCircle size={20} />
          <span>Help</span>
        </button>
        <button className={styles.navItem}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
