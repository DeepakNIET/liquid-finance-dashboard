import React, { useState } from 'react';
import { Pen, Moon, DollarSign, Bell, Shield, Eye, Check, ShieldCheck, X, User, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './settings.module.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Settings: React.FC = () => {
  const { 
    role, setRole, theme, setTheme, 
    currency, setCurrency, 
    alertsEnabled, setAlertsEnabled, 
    addNotification,
    profile, updateProfile
  } = useAppContext();

  React.useEffect(() => { document.title = 'Liquid | Settings'; }, []);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(tempProfile);
    setIsEditingProfile(false);
  };

  const handleDownloadReport = () => {
    try {
      addNotification("Synthesizing Overall Finance Audit...");
      const doc = new jsPDF();
      
      // Premium Header Bar
      doc.setFillColor(18, 24, 38);
      doc.rect(0, 0, 210, 50, 'F');
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("PERSONAL INTELLIGENCE AUDIT", 20, 32);
      
      doc.setFontSize(10);
      doc.setTextColor(86, 194, 165);
      doc.text("COMPLETE WEALTH & IDENTITY SUMMARY", 20, 42);

      // Section 1: Identity Profile
      doc.setTextColor(0);
      doc.setFontSize(14);
      doc.text("1. QUANTUM IDENTITY & ACCESS", 20, 65);
      
      autoTable(doc, {
        startY: 70,
        head: [['Identity Node', 'Attribution']],
        body: [
          ['Primary Name', profile.name],
          ['Email Vector', profile.email],
          ['Membership Tier', profile.tier],
          ['Authority Level', role.toUpperCase()],
          ['System Theme', theme.toUpperCase()],
          ['Native Currency', currency]
        ],
        theme: 'plain',
        styles: { fontSize: 9 }
      });

      // Section 2: Wealth Distribution Snapshot
      const finalY1 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("2. LIQUID WEALTH MATRIX", 20, finalY1);
      
      autoTable(doc, {
        startY: finalY1 + 8,
        head: [['Structural Node', 'Quantum Value', 'Status']],
        body: [
          ['Total Balance', "248,390.00", 'Growth (+12.4%)'],
          ['Monthly Inflow', "42,105.50", 'Stable (+4.1%)'],
          ['Monthly Expenses', "18,440.12", 'Decreasing (-2.5%)'],
          ['Net Savings Rate', "56.2%", 'OPTIMIZED'],
          ['Liquidity Index', "0.84", 'HIGH STABILITY']
        ],
        theme: 'striped',
        headStyles: { fillColor: [86, 194, 165] }
      });

      // Section 3: Strategic Advice
      const finalY2 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("3. STRATEGIC FINANCE ADVICE", 20, finalY2);
      
      const advice = [
        ["Liquidity Guard", "Keep index > 0.8 to facilitate 100% inward liquidity flux."],
        ["Tier Management", `As a ${profile.tier}, your asset variance threshold is ±5%.`],
        ["Expenditure Logic", "Maintain current outflow reduction for 2 more cycles."],
        ["Role Insights", `Your ${role} status grants access to advanced risk metrics.`]
      ];

      autoTable(doc, {
        startY: finalY2 + 8,
        head: [['Strategy Node', 'Intelligence Insight']],
        body: advice,
        styles: { cellWidth: 'wrap' },
        columnStyles: { 1: { cellWidth: 125 } }
      });

      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Liquid Intelligence | Secure Personal Audit | Generated on ${new Date().toLocaleString()}`, 20, 285);

      doc.save(`Liquid_Full_Audit_${profile.name.replace(/\s+/g, '_')}.pdf`);
      addNotification("Overall Finance Report Downloaded.");
    } catch (e) {
      console.error(e);
      addNotification("Report generation failed.");
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in-up`}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.pageTitle}>System Preferences</h1>
            <p className={styles.pageSubtitle}>Manage your digital identity and interface experience.</p>
          </div>
          <button className={styles.getReportBtn} onClick={handleDownloadReport}>
            <FileText size={16} /> Get Report
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.column}>
          {/* Profile */}
          <div className={`${styles.card} ${styles.profileCenter}`}>
            <div className={styles.avatarWrapper}>
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className={styles.avatar} 
              />
              {role === 'admin' && (
                <button className={styles.editAvatarBtn} onClick={() => setIsEditingProfile(true)}>
                  <Pen size={14} />
                </button>
              )}
            </div>
            <div className={styles.profileName}>{profile.name}</div>
            <div className={styles.profileEmail}>{profile.email}</div>
            
            <div className={styles.membershipLabel}>Membership</div>
            <div className={styles.membershipTier}>{profile.tier}</div>
            
            <button className={styles.updateBtn} onClick={() => role === 'admin' ? setIsEditingProfile(true) : addNotification("Cloud sync available for Administrators only.")}>
              {role === 'admin' ? 'Edit Admin Identity' : 'Cloud Update Profile'}
            </button>
          </div>

          {/* General Settings */}
          <div className={styles.card}>
            <div className={styles.prefList}>
              <div className={styles.prefItem}>
                <div className={styles.prefLeft}>
                  <div className={styles.prefIcon}><Moon size={20} /></div>
                  <div className={styles.prefTexts}>
                    <div className={styles.prefTitle}>Dark Interface</div>
                    <div className={styles.prefDesc}>Switch system theme</div>
                  </div>
                </div>
                <div 
                  className={`${styles.toggle} ${theme === 'dark' ? styles.active : ''}`}
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>

              <div className={styles.prefItem}>
                <div className={styles.prefLeft}>
                  <div className={styles.prefIcon}><DollarSign size={20} /></div>
                  <div className={styles.prefTexts}>
                    <div className={styles.prefTitle}>Currency Display</div>
                    <div className={styles.prefDesc}>Switch between USD and INR</div>
                  </div>
                </div>
                <div className={styles.currencyToggle}>
                  <button 
                    className={`${styles.currBtn} ${currency === 'USD' ? styles.active : ''}`}
                    onClick={() => setCurrency('USD')}
                  >
                    USD
                  </button>
                  <button 
                    className={`${styles.currBtn} ${currency === 'INR' ? styles.active : ''}`}
                    onClick={() => setCurrency('INR')}
                  >
                    INR
                  </button>
                </div>
              </div>

              <div className={styles.prefItem}>
                <div className={styles.prefLeft}>
                  <div className={styles.prefIcon}><Bell size={20} /></div>
                  <div className={styles.prefTexts}>
                    <div className={styles.prefTitle}>Push Alerts</div>
                    <div className={styles.prefDesc}>Real-time trading news</div>
                  </div>
                </div>
                <div 
                  className={`${styles.toggle} ${alertsEnabled ? styles.active : ''}`}
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.column}>
          {/* Role Architecture */}
          <div className={styles.roleCard}>
            <div className={styles.cardTitle}>Role Architecture</div>
            <div className={styles.cardDesc}>
              Define your level of control within the ecosystem. Switching roles may restrict or enable advanced analytical tools.
            </div>

            <div className={styles.roleGrid}>
              <div 
                className={`${styles.roleBox} ${role === 'admin' ? styles.active : ''}`}
                onClick={() => setRole('admin')}
              >
                {role === 'admin' && (
                  <div className={styles.checkBadge}>
                    <Check size={14} />
                  </div>
                )}
                <div className={styles.roleIcon}><Shield size={24} /></div>
                <div className={styles.roleName}>Administrator</div>
                <div className={styles.roleDesc}>
                  Full governance privileges. Access to risk adjustment engines, liquidity overrides, and user permission matrices.
                </div>
                <button className={`
                  ${styles.roleActionBtn} 
                  ${role === 'admin' ? (theme === 'dark' ? styles.darkActive : styles.lightActive) : ''}
                `}>
                  {role === 'admin' ? 'Active Privilege' : 'Switch to Admin'}
                </button>
              </div>

              <div 
                className={`${styles.roleBox} ${role === 'viewer' ? styles.active : ''}`}
                onClick={() => setRole('viewer')}
              >
                {role === 'viewer' && (
                  <div className={styles.checkBadge}>
                    <Check size={14} />
                  </div>
                )}
                <div className={styles.roleIcon}><Eye size={24} /></div>
                <div className={styles.roleName}>Strategic Viewer</div>
                <div className={styles.roleDesc}>
                  Observe market patterns and generated insights without transactional liability. Perfect for reporting and analysis.
                </div>
                <button className={`
                  ${styles.roleActionBtn} 
                  ${role === 'viewer' ? (theme === 'dark' ? styles.darkActive : styles.lightActive) : ''}
                `}>
                  {role === 'viewer' ? 'Active View' : 'Switch to View'}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.tfaCard}>
            <div className={styles.tfaContent}>
              <ShieldCheck size={32} color="var(--color-text-muted)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>Two-Factor Authentication</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Last verified 2 hours ago from New York, USA</div>
              </div>
            </div>
            <button className={styles.btnSolid} onClick={() => addNotification("Security keys are managed by your Hardware Vault.")}>Manage Keys</button>
          </div>
        </div>
      </div>
      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={styles.modalIcon}><User size={20} /></div>
                <h3>Edit Administrator Identity</h3>
              </div>
              <button onClick={() => setIsEditingProfile(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleProfileSave} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Membership Tier</label>
                <select 
                  value={tempProfile.tier}
                  onChange={(e) => setTempProfile({...tempProfile, tier: e.target.value})}
                >
                  <option value="Elite Tier Investor">Elite Tier Investor</option>
                  <option value="Alpha Strategist">Alpha Strategist</option>
                  <option value="Core Contributor">Core Contributor</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditingProfile(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
