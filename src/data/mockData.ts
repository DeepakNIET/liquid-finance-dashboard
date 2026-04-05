export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
}

export const initialTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: 'Oct 24, 2023',
    description: 'Amazon Web Services',
    category: 'OPERATIONS',
    type: 'Expense',
    amount: -1240.00,
  },
  {
    id: 'tx2',
    date: 'Oct 22, 2023',
    description: 'Stripe Payout: Q3 Revenue',
    category: 'INCOME',
    type: 'Income',
    amount: 42500.00,
  },
  {
    id: 'tx3',
    date: 'Oct 20, 2023',
    description: 'Wework NY Office Rent',
    category: 'OPERATIONS',
    type: 'Expense',
    amount: -5800.00,
  },
  {
    id: 'tx4',
    date: 'Oct 19, 2023',
    description: 'The Blue Ribbon Dinner',
    category: 'LIFESTYLE',
    type: 'Expense',
    amount: -342.15,
  },
  {
    id: 'tx5',
    date: 'Oct 18, 2023',
    description: 'Dividends: Global Tech ETF',
    category: 'INVESTMENTS',
    type: 'Income',
    amount: 1450.60,
  },
];

export const mockInsights = {
  highestSpending: 'Operations',
  efficiencySaved: 12,
  subscriptionIncrease: 45,
};

export const chartDataBalance = [
  { month: 'Jan', value: 120000 },
  { month: 'Feb', value: 150000 },
  { month: 'Mar', value: 130000 },
  { month: 'Apr', value: 180000 },
  { month: 'May', value: 210000 },
  { month: 'Jun', value: 248390.00 },
];

export const chartDataAllocation = [
  { name: 'Housing', value: 45, color: '#14b8a6' },
  { name: 'Entertainment', value: 25, color: '#0f172a' },
  { name: 'Food', value: 20, color: '#64748b' },
  { name: 'Transport', value: 10, color: '#94a3b8' },
];

export const chartDataComparison = [
  { month: 'Jul', income: 42000, expenses: 18000 },
  { month: 'Aug', income: 48000, expenses: 22000 },
  { month: 'Sep', income: 45000, expenses: 20000 },
  { month: 'Oct', income: 52000, expenses: 19000 },
  { month: 'Nov', income: 40000, expenses: 23000 },
  { month: 'Dec', income: 49000, expenses: 21000 },
];
