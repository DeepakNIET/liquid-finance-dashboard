import React from 'react';
import { Search, Bell, Moon, Sun, Shield, Trash2, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './layout.module.css';

export const Topbar: React.FC = () => {
  const { 
    role, theme, setTheme, 
    notifications, markNotificationsAsRead, clearNotifications,
    activeView, setActiveView
  } = useAppContext();
  
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Click away to close notifications
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const handleToggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      setTimeout(() => markNotificationsAsRead(), 500);
    }
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.mobileBrand}>Liquid Intelligence</div>
      <div className={styles.pageTitleLabel}>The Ethereal Analyst</div>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Global search..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.topLinks}>
        <button 
          className={`${styles.topLink} ${activeView === 'dashboard' ? styles.active : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`${styles.topLink} ${activeView === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveView('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className={styles.actions}>
        <div className={styles.avatar}>
          <img src="https://ui-avatars.com/api/?name=Alexander+Vance&background=0D8ABC&color=fff" alt="User Avatar" />
        </div>

        <button 
          className={styles.iconBtn} 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className={`${styles.iconBtn} ${unreadCount > 0 ? styles.hasNotif : ''}`} onClick={handleToggleNotif}>
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
        </button>

        {isNotifOpen && (
          <div className={styles.notifDropdown} ref={notifRef}>
            <div className={styles.notifHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={16} />
                <span>Recent Activity</span>
              </div>
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className={styles.clearBtn}>Clear All</button>
              )}
            </div>
            <div className={styles.notifList}>
              {notifications.length === 0 ? (
                <div className={styles.emptyNotif}>
                   <Bell size={24} style={{ marginBottom: 12, opacity: 0.5 }} />
                   <div>No recent activity</div>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`${styles.notifItem} ${n.read ? '' : styles.unread}`}>
                    <div className={styles.notifIcon}>
                      {n.message.includes('Deleted') ? <Trash2 size={14} color="#ef4444" /> : <CheckCircle size={14} color="#10b981" />}
                    </div>
                    <div className={styles.notifContent}>
                      <div className={styles.notifMsg}>{n.message}</div>
                      <div className={styles.notifTime}>{n.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {role === 'admin' && (
          <div className={styles.adminBadge}>
            <Shield size={14} />
            Admin Mode
          </div>
        )}
      </div>
    </header>
  );
};
