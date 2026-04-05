import { type Transaction, initialTransactions } from '../data/mockData';

const STORAGE_KEY = 'liquid_finance_transactions';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockAPI = {
  async fetchTransactions(): Promise<Transaction[]> {
    await delay(600); // simulate latency
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored transactions", e);
      }
    }
    // Setup initial if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransactions));
    return initialTransactions;
  },

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    await delay(300);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
};
