
import { CategoryType, Transaction, UserRole } from '@/types/finance';
import { generateId } from '@/utils/financeUtils';

// Mock Categories
export const mockCategories: CategoryType[] = [
  { id: 'cat-1', name: 'Marketing', type: 'expense', color: '#F87171' },
  { id: 'cat-2', name: 'Logistics', type: 'expense', color: '#60A5FA' },
  { id: 'cat-3', name: 'Salaries', type: 'expense', color: '#34D399' },
  { id: 'cat-4', name: 'Inventory', type: 'expense', color: '#A78BFA' },
  { id: 'cat-5', name: 'Utilities', type: 'expense', color: '#FBBF24' },
  { id: 'cat-6', name: 'Rent', type: 'expense', color: '#EC4899' },
  { id: 'cat-7', name: 'Product Sales', type: 'revenue', color: '#10B981' },
  { id: 'cat-8', name: 'Service Income', type: 'revenue', color: '#6366F1' },
  { id: 'cat-9', name: 'Investments', type: 'revenue', color: '#8B5CF6' },
  { id: 'cat-10', name: 'Other', type: 'both', color: '#9CA3AF' },
];

// Generate random date within the last 6 months
const randomDate = () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  return new Date(
    sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
  );
};

// Generate mock transactions
export const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const isExpense = Math.random() > 0.4; // 60% expenses, 40% revenue
    const type = isExpense ? 'expense' : 'revenue';
    const categoryPool = mockCategories.filter(c => c.type === type || c.type === 'both');
    const category = categoryPool[Math.floor(Math.random() * categoryPool.length)];
    const date = randomDate();
    const amount = parseFloat((Math.random() * 2000 + 50).toFixed(2));
    const vatExempt = Math.random() > 0.8; // 20% chance of being VAT exempt
    const vat = vatExempt ? 0 : parseFloat((amount * 0.19).toFixed(2));
    const totalAmount = parseFloat((amount + vat).toFixed(2));
    
    transactions.push({
      id: generateId(),
      date,
      type: type as 'expense' | 'revenue',
      categoryId: category.id,
      description: `${type === 'expense' ? 'Payment for' : 'Income from'} ${category.name.toLowerCase()}`,
      amount,
      vat,
      totalAmount,
      notes: Math.random() > 0.7 ? `Note for transaction #${i+1}` : undefined,
      recurring: Math.random() > 0.8,
      recurringFrequency: Math.random() > 0.5 ? 'monthly' : 'yearly',
      vatExempt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  // Sort by date, newest first
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Mock Users
export const mockUsers = [
  { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: 'admin' as UserRole },
  { id: 'user-2', name: 'Accountant', email: 'accountant@example.com', role: 'accountant' as UserRole },
  { id: 'user-3', name: 'Viewer', email: 'viewer@example.com', role: 'viewer' as UserRole },
];

// Actual mock data export
export const mockTransactions = generateMockTransactions(50);
