import React from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, PieChart as PieIcon, Target, Zap, ArrowRight, Wallet, Download } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell, PieChart, Pie, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { chartDataBalance, chartDataAllocation, initialTransactions } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import styles from './overview.module.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Overview: React.FC = () => {
  const { theme, formatCurrency, activeView, profile, transactions, addNotification, role } = useAppContext();
  const [range, setRange] = React.useState('6M');
  
  React.useEffect(() => { 
    document.title = activeView === 'analytics' ? 'Liquid | Analytics' : 'Liquid | Dashboard'; 
  }, [activeView]);

  // Dynamic chart data simulation based on range
  const getChartData = () => {
    const data: any[] = chartDataBalance.map(d => ({
      ...d,
      value: d.value
    }));
    switch(range) {
      case '3M': return data.slice(-3).map(d => ({ ...d, forecast: d.value * (1 + (Math.random() * 0.15)) }));
      case '1Y': 
        return [
          {month: 'Jul', value: 80000}, {month: 'Aug', value: 95000}, {month: 'Sep', value: 110000},
          {month: 'Oct', value: 120000}, {month: 'Nov', value: 150000}, {month: 'Dec', value: 130000},
          ...chartDataBalance
        ].map(d => ({ ...d, forecast: d.value * (1 + (Math.random() * 0.15)) }));
      default: return data.map(d => ({ ...d, forecast: d.value * (1 + (Math.random() * 0.15)) })); // 6M
    }
  };

  const handleDownloadFinancialReport = () => {
    try {
      addNotification("Generating Personal Audit...");
      const doc = new jsPDF();
      
      // Header Section
      doc.setFillColor(18, 24, 38);
      doc.rect(0, 0, 210, 50, 'F');
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.text("FINANCIAL HEALTH AUDIT", 20, 32);
      
      doc.setFontSize(10);
      doc.setTextColor(86, 194, 165);
      doc.text("LIQUID INTELLIGENCE PREMIUM SERVICE", 20, 42);

      // Identity Profile Section
      doc.setTextColor(0);
      doc.setFontSize(14);
      doc.text("1. QUANTUM IDENTITY PROFILE", 20, 65);
      
      autoTable(doc, {
        startY: 70,
        head: [['Attribute', 'Data Point']],
        body: [
          ['Name', profile.name],
          ['E-mail Node', profile.email],
          ['Membership Tier', profile.tier],
          ['Role Authority', role.toUpperCase()]
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 4 }
      });

      // Wealth Structural Snapshot
      const finalY1 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("2. LIQUID WEALTH DISTRIBUTION", 20, finalY1);
      
      autoTable(doc, {
        startY: finalY1 + 10,
        head: [['Asset Node', 'Value', 'Performance']],
        body: [
          ['Total Balance', formatCurrency(248390.00), '+12.4%'],
          ['Monthly Income', formatCurrency(42105.50), '+4.1%'],
          ['Monthly Expenses', formatCurrency(18440.12), '-2.5%'],
          ['Projected Surplus', formatCurrency(23665.38), 'Optimized']
        ],
        theme: 'striped',
        headStyles: { fillColor: [86, 194, 165] }
      });

      // Recent Structural Flux (Transactions)
      const finalY2 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("3. RECENT STRUCTURAL FLUX", 20, finalY2);

      const txData = transactions.slice(0, 15).map(tx => [
        tx.date,
        tx.description,
        tx.category,
        formatCurrency(tx.amount)
      ]);

      autoTable(doc, {
        startY: finalY2 + 10,
        head: [['Cycle Date', 'Transaction Node', 'Category', 'Quantum Value']],
        body: txData,
        headStyles: { fillColor: [18, 24, 38] }
      });

      doc.save(`FinanceAudit_${profile.name.replace(/\s+/g, '_')}.pdf`);
      addNotification("Comprehensive Audit Downloaded.");
    } catch (e) {
      console.error(e);
      addNotification("Audit engine failure.");
    }
  };
  
  const currentChartData = getChartData();
  const mintColor = '#56c2a5';
  const mintLight = '#a6dfd1';
  const accentBlue = '#38bdf8';
  const darkNavy = theme === 'dark' ? '#f8fafc' : '#121826';

  if (activeView === 'analytics') {
    return (
      <div className={`${styles.overviewGrid} animate-fade-in-up`}>
        <div className={styles.pageHeader}>
          <h1 className={styles.mainTitle}>Financial Intelligence</h1>
          <p className={styles.mainSubtitle}>Advanced predictive modeling and structural wealth analysis.</p>
        </div>

        {/* Analytics Top Cards */}
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Savings Rate</div>
          <div className={styles.cardValue}>56.2%</div>
          <div className={`${styles.trendBadge} ${styles.positive}`}>
            <Target size={14} /> Optimization active
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Liquidity Index</div>
          <div className={styles.cardValue}>0.84</div>
          <div className={`${styles.trendBadge} ${styles.positive}`}>
            <Zap size={14} /> High stability
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Expenditure Forecast</div>
          <div className={styles.cardValue}>{formatCurrency(19200.00)}</div>
          <div className={`${styles.trendBadge} ${styles.negative}`} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
            <TrendingDown size={14} /> Expected next month
          </div>
        </div>

        {/* Wealth Distribution */}
        <div className={styles.mainChartCard}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.cardHeading}>Wealth Structural Analysis</div>
              <div className={styles.cardSubheading}>Structural growth vs. market fluctuations</div>
            </div>
            <div className={styles.legendList} style={{ flexDirection: 'row', gap: 16 }}>
              <div className={styles.legendItem}><div className={styles.legendDot} style={{ backgroundColor: mintColor }} /><span>Assets</span></div>
              <div className={styles.legendItem}><div className={styles.legendDot} style={{ backgroundColor: accentBlue }} /><span>Forecast</span></div>
            </div>
          </div>
          
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={mintColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={mintColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-lg)', background: theme === 'dark' ? '#1e293b' : '#fff' }}
                  formatter={(val: any) => [formatCurrency(Number(val || 0)), 'Structural Value']}
                />
                <Area type="monotone" dataKey="value" stroke={mintColor} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" name="Assets" />
                <Area type="monotone" dataKey="forecast" stroke={accentBlue} strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Column */}
        <div className={styles.donutCard}>
          <div className={styles.cardHeading}>Intelligence Feeds</div>
          <div className={styles.insightList}>
            <div className={styles.insightItem}>
              <div className={styles.insightIcon}><PieIcon size={18} /></div>
              <div className={styles.insightText}>
                <strong>Diversification Alert</strong>
                <p>Operations overlap exceeds 40% threshold.</p>
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightIcon}><ArrowRight size={18} /></div>
              <div className={styles.insightText}>
                <strong>Optimization Node</strong>
                <p>Switching to INR display shows 2% variance.</p>
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightIcon}><Wallet size={18} /></div>
              <div className={styles.insightText}>
                <strong>Liquidity Spike</strong>
                <p>Unusual inward flow detected from Alpha.</p>
              </div>
            </div>
          </div>
          <button className={styles.insightBtn} onClick={handleDownloadFinancialReport}>
            <Download size={16} /> Download Comprehensive Audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.overviewGrid} animate-fade-in-up`}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.mainTitle}>Dashboard Overview</h1>
        <p className={styles.mainSubtitle}>Monitor your financial health and account performance.</p>
      </div>

      {/* Top Cards */}
      <div className={styles.summaryCard}>
        <div className={styles.cardTitle}>Total Balance</div>
        <div className={styles.cardValue}>{formatCurrency(248390.00)}</div>
        <div className={`${styles.trendBadge} ${styles.positive}`}>
          <TrendingUp size={14} /> +12.4% this month
        </div>
      </div>
      
      <div className={styles.summaryCard}>
        <div className={styles.cardTitle}>Monthly Income</div>
        <div className={styles.cardValue}>{formatCurrency(42105.50)}</div>
        <div className={`${styles.trendBadge} ${styles.positive}`}>
          <TrendingUp size={14} /> +4.1%
        </div>
      </div>
      
      <div className={styles.summaryCard}>
        <div className={styles.cardTitle}>Monthly Expenses</div>
        <div className={styles.cardValue}>{formatCurrency(18440.12)}</div>
        <div className={`${styles.trendBadge} ${styles.negative}`}>
          <TrendingDown size={14} /> -2.5% vs last month
        </div>
      </div>

      {/* Main Chart */}
      <div className={styles.mainChartCard}>
        <div className={styles.chartHeader}>
          <div>
            <div className={styles.cardHeading}>Balance Evolution</div>
            <div className={styles.cardSubheading}>Wealth accumulation over the last selectable range</div>
          </div>
          <div className={styles.timeFilters}>
            <button className={`${styles.timeFilterBtn} ${range === '3M' ? styles.active : ''}`} onClick={() => setRange('3M')}>3M</button>
            <button className={`${styles.timeFilterBtn} ${range === '6M' ? styles.active : ''}`} onClick={() => setRange('6M')}>6M</button>
            <button className={`${styles.timeFilterBtn} ${range === '1Y' ? styles.active : ''}`} onClick={() => setRange('1Y')}>1Y</button>
          </div>
        </div>
        
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: theme === 'dark' ? '#1e293b' : '#fff' }}
                labelStyle={{ fontWeight: 700, color: 'var(--color-text-main)' }}
                formatter={(val: any) => [formatCurrency(Number(val || 0)), 'Balance']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {currentChartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === currentChartData.length - 1 ? darkNavy : mintLight} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', marginTop: 8 }}>
          {currentChartData.map((d, i) => (
            <span key={`${d.month}-${i}`} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              {d.month.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Donut Chart */}
      <div className={styles.donutCard}>
        <div className={styles.cardHeading}>Allocation</div>
        
        <div style={{ width: '100%', height: 200, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDataAllocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartDataAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none' }} 
                formatter={(val: any) => [`${val || 0}%`, 'Weight']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{formatCurrency(18440).split('.')[0]}</div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>Spent</div>
          </div>
        </div>

        <div className={styles.legendList}>
          {chartDataAllocation.map((item) => (
            <div key={item.name} className={styles.legendItem}>
              <div className={styles.legendLabel}>
                <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentCard}>
        <div className={styles.chartHeader}>
          <div className={styles.cardHeading}>Recent Activities</div>
          <button style={{ fontWeight: 600, fontSize: '0.85rem' }}>View All History</button>
        </div>
        <div className={styles.cardSubheading} style={{ marginTop: '-24px' }}>
          Live feed of your most recent transactions
        </div>

        <div className={styles.recentList}>
          <div className={styles.txItem}>
            <div className={styles.txLeft}>
              <div className={styles.txIcon}>
                <ShoppingBag size={20} />
              </div>
              <div className={styles.txDetails}>
                <span className={styles.txName}>Apple Store Online</span>
                <span className={styles.txMeta}>Jun 14, 2024 • Electronics</span>
              </div>
            </div>
            <div className={styles.txRight}>
              <span className={styles.txAmount}>-{formatCurrency(1299.00)}</span>
              <span className={styles.txStatus}>COMPLETED</span>
            </div>
          </div>
          {initialTransactions.slice(0, 2).map((tx) => (
            <div className={styles.txItem} key={tx.id}>
              <div className={styles.txLeft}>
                <div className={styles.txIcon}>
                  <ShoppingBag size={20} />
                </div>
                <div className={styles.txDetails}>
                  <span className={styles.txName}>{tx.description}</span>
                  <span className={styles.txMeta}>{tx.date} • {tx.category}</span>
                </div>
              </div>
              <div className={styles.txRight}>
                <span className={styles.txAmount} style={{ color: tx.amount > 0 ? 'var(--color-accent-mint)' : 'inherit'}}>
                  {tx.amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </span>
                <span className={styles.txStatus}>COMPLETED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
