import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import styles from './layout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activePage, setActivePage }) => {
  return (
    <div className={styles.appContainer}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className={styles.mainContent}>
        <Topbar />
        <main className={styles.pageContainer}>
          {children}
        </main>
      </div>
    </div>
  );
};
