
/**
 * Finance utility functions for the German finance tracker
 */

// Calculate VAT (19% in Germany)
export const calculateVAT = (amount: number): number => {
  return parseFloat((amount * 0.19).toFixed(2));
};

// Calculate gross amount (amount + VAT)
export const calculateGrossAmount = (amount: number): number => {
  return parseFloat((amount + calculateVAT(amount)).toFixed(2));
};

// Format currency as EUR (always shows currency symbol)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Format amount conditionally with or without currency symbol
export const formatAmount = (amount: number, showCurrency: boolean = true): string => {
  if (showCurrency) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  } else {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
};

// Format date in German format (DD.MM.YYYY)
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('de-DE').format(date);
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get month name in German
export const getMonthName = (month: number): string => {
  return new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(new Date(2000, month, 1));
};

// Calculate total for a period from transactions
export const calculateTotal = (
  transactions: any[], 
  type?: 'expense' | 'revenue'
): number => {
  return transactions
    .filter(t => type ? t.type === type : true)
    .reduce((sum, t) => sum + (type === 'expense' ? -t.amount : t.amount), 0);
};
