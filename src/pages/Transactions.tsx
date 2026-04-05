import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Edit2, Hexagon, ShieldAlert, ShieldCheck, TrendingUp, Plus, Trash2, X, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './transactions.module.css';

export const Transactions: React.FC = () => {
  const { transactions, formatCurrency, role, addTransaction, editTransaction, deleteTransaction } = useAppContext();
  
  React.useEffect(() => { document.title = 'Liquid | Transactions'; }, []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'OPERATIONS',
    type: 'Expense' as 'Income' | 'Expense',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOption, setSortOption] = useState('date-desc');

  let filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter.toUpperCase();
    const matchesType = typeFilter === 'All' || tx.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Sorting
  filteredTransactions.sort((a, b) => {
    if (sortOption === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
    if (sortOption === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
    
    // Date sorting (assuming "Oct 24, 2023" format parseable by Date)
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (sortOption === 'date-asc') return dateA - dateB;
    return dateB - dateA; // default date-desc
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'viewer') return;

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum)) return showToast('Invalid amount', 'error');

    if (editingId) {
      editTransaction({
        ...formData,
        id: editingId,
        amount: amountNum
      });
      showToast('Transaction updated successfully', 'success');
    } else {
      addTransaction({
        ...formData,
        amount: amountNum
      });
      showToast('Transaction added successfully', 'success');
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (role === 'viewer') return;
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      showToast('Transaction deleted', 'success');
    }
  };

  const openModal = (id?: string) => {
    if (role === 'viewer') return;
    if (id) {
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        setFormData({
          description: tx.description,
          amount: Math.abs(tx.amount).toString(),
          category: tx.category,
          type: tx.type,
          date: tx.date
        });
        setEditingId(id);
      }
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'OPERATIONS',
        type: 'Expense',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className={`${styles.container} animate-fade-in-up`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Transactions Ledger</h1>
          <p className={styles.pageSubtitle}>
            Real-time analytical breakdown of your premium financial flows across all active accounts.
          </p>
        </div>
        <div className={styles.liquidity}>
          <div className={styles.liquidityLabel}>Net Liquidity</div>
          <div className={styles.liquidityValue}>
            ${transactions.reduce((acc, tx) => acc + (tx.type === 'Income' ? tx.amount : -tx.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        {role === 'admin' && (
          <button className={styles.adminActionBtn} onClick={() => openModal()}>
            <Plus size={18} /> Add Transaction
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div className={styles.tableCard}>
        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchInput}>
            <Search size={18} color="var(--color-text-muted)" />
            <input 
              type="text" 
              placeholder="Search descriptions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className={styles.select} 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Category: All</option>
            <option value="Operations">Operations</option>
            <option value="Income">Income</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Investments">Investments</option>
          </select>
          
          <select 
            className={styles.select}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">Type: All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          
          <select 
            className={styles.select}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', marginBottom: '8px' }}>No transactions found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className={styles.date}>{tx.date}</td>
                  <td>
                    <div className={styles.descWrapper}>
                      <div className={styles.descIcon}>
                        <Hexagon size={16} />
                      </div>
                      <span className={styles.descText}>{tx.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryPill}>{tx.category}</span>
                  </td>
                  <td>
                    <div className={`${styles.typeWrapper} ${tx.type === 'Income' ? styles.income : styles.expense}`}>
                      {tx.type === 'Income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                      {tx.type}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.amount} ${tx.type === 'Income' ? styles.income : ''}`}>
                      {tx.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td>
                      <div className={styles.actionCell}>
                        <button className={styles.actionBtn} title="Edit" onClick={() => openModal(tx.id)}>
                          <Edit2 size={16} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.delete}`} title="Delete" onClick={() => handleDelete(tx.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        )}

        {/* Pagination mock */}
        {filteredTransactions.length > 0 && (
          <div className={styles.pagination}>
            <div className={styles.pageInfo}>
              Showing 1-{filteredTransactions.length} of {filteredTransactions.length} transactions
            </div>
            <div className={styles.pageControls}>
              <button className={styles.pageBtn}>&lt;</button>
              <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
              <button className={styles.pageBtn}>&gt;</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Growth Forecast</div>
          <div className={styles.statValue}>+12.4%</div>
          <div className={styles.statDesc}>
            Expected increase in net cash flow next quarter based on current spending.
          </div>
          <TrendingUp className={styles.statIconBg} size={80} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader} style={{ color: 'var(--color-text-main)' }}>Spending Alert</div>
          <div className={styles.statValue}>Lifestyle +18%</div>
          <div className={styles.statDesc}>
            Lifestyle expenses have surpassed your set threshold for this month.
          </div>
          <ShieldAlert className={styles.statIconBg} size={80} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader} style={{ color: 'var(--color-text-muted)' }}>Security Status</div>
          <div className={styles.statValue}>All Verified</div>
          <div className={styles.statDesc}>
            No anomalous transaction patterns detected by the Ethereal Analyst.
          </div>
          <ShieldCheck className={styles.statIconBg} size={80} />
        </div>
      </div>

      {/* Admin Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} animate-fade-in-up`}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingId ? 'Edit Transaction' : 'New Transaction'}</h2>
              <button onClick={closeModal} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddOrEdit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Description</label>
                <input 
                  type="text" 
                  required 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required 
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as 'Income' | 'Expense'})}
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="OPERATIONS">OPERATIONS</option>
                  <option value="INVESTMENTS">INVESTMENTS</option>
                  <option value="LIFESTYLE">LIFESTYLE</option>
                  <option value="INCOME">INCOME</option>
                </select>
              </div>
              <button type="submit" className={styles.submitBtn}>
                {editingId ? 'Update Transaction' : 'Create Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]} animate-fade-in-up`}>
          {toast.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
