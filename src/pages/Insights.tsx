import React from 'react';
import { Upload, Clapperboard, PiggyBank, Tv } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { chartDataComparison } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import styles from './insights.module.css';

export const Insights: React.FC = () => {
  const { theme } = useAppContext();
  
  const mintColor = '#56c2a5';
  const navyColor = theme === 'dark' ? '#f8fafc' : '#0f172a';

  const handleExport = () => {
    // Generate CSV from our transactions array
    const { transactions } = useAppContext();
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(tx => [
        `"${tx.date}"`,
        `"${tx.description}"`,
        `"${tx.category}"`,
        `"${tx.type}"`,
        tx.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'liquid_intelligence_insights.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`${styles.container} animate-fade-in-up`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Financial Insights</h1>
          <p className={styles.pageSubtitle}>An editorial view of your capital movement.</p>
        </div>
        <button className={styles.exportBtn} onClick={handleExport}>
          <Upload size={16} /> Export Insights
        </button>
      </div>

      {/* Top Grid: Primary Insight + Minis */}
      <div className={styles.topGrid}>
        <div className={styles.primaryCard}>
          <div className={styles.primaryLabel}>Primary Insight</div>
          <div className={styles.primaryTitle}>Entertainment</div>
          
          <div className={styles.iconWrapper}>
            <Clapperboard size={24} />
          </div>

          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '8px' }}>Monthly Total</div>
          <div className={styles.primaryTotal}>
            $2,450.00
            <div className={styles.trendTag}>
              ↗ +18.4% vs prev. month
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '65%' }} />
          </div>
        </div>

        <div className={styles.miniCards}>
          <div className={styles.miniCard}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className={`${styles.miniIcon} ${styles.mint}`}>
                <PiggyBank size={20} />
              </div>
              <div>
                <div className={styles.miniLabel}>Efficiency Boost</div>
                <div className={styles.miniDesc}>You saved 12% more than last month!</div>
              </div>
            </div>
          </div>
          <div className={styles.miniCard}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className={`${styles.miniIcon} ${styles.red}`}>
                <Tv size={20} />
              </div>
              <div>
                <div className={styles.miniLabel}>Cost Alert</div>
                <div className={styles.miniDesc}>Subscription costs increased by $45</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <div className={styles.chartTitle}>Monthly Comparison</div>
            <div className={styles.chartDesc}>Net flow: Income vs Expenses over the last 6 months</div>
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: navyColor }} />
              INCOME
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: mintColor }} />
              EXPENSES
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartDataComparison} 
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barGap={4}
              barSize={16}
            >
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }}
              />
              <Bar dataKey="income" fill={navyColor} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill={mintColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 20px', marginTop: 12 }}>
          {chartDataComparison.map(d => (
            <span key={d.month} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {d.month}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className={styles.bottomGrid}>
        <div className={styles.densityCard}>
          <div className={styles.densityTitle}>Portfolio Density</div>
          <div className={styles.densityDesc}>Asset distribution across risk tiers.</div>

          <div className={styles.densityRow}>
            <div className={styles.densityHeader}>
              <span>Low Risk</span>
              <span>42%</span>
            </div>
            <div className={styles.densityBar}>
              <div className={styles.densityFill} style={{ width: '42%', backgroundColor: mintColor }} />
            </div>
          </div>

          <div className={styles.densityRow}>
            <div className={styles.densityHeader}>
              <span>Aggressive</span>
              <span>58%</span>
            </div>
            <div className={styles.densityBar}>
              <div className={styles.densityFill} style={{ width: '58%', backgroundColor: navyColor }} />
            </div>
          </div>
        </div>

        <div className={styles.recoCard}>
          <div className={styles.recoTitle}>The Analyst's Recommendation</div>
          <div className={styles.recoDesc}>
            Based on your spending in Entertainment this month, redirecting $300 to your 'Growth' bucket could yield an estimated 4.5% APR increase over the next quarter.
          </div>
          <button className={styles.recoBtn}>Optimize My Portfolio</button>
        </div>
      </div>
    </div>
  );
};
