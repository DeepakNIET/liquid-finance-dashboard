import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Overview } from './pages/Overview';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { AppProvider, useAppContext } from './context/AppContext';
import './styles/global.css';

function AppComponent() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  const { isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-body)' }}>
        <div style={{ padding: '24px', borderRadius: '50%', borderTop: '4px solid var(--color-accent-mint)', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </MainLayout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppComponent />
    </AppProvider>
  );
}

export default App;
