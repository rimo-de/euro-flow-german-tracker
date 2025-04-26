import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/finance";
import * as XLSX from 'xlsx';

export const uploadInvoice = async (file: File, userId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(fileName, file);

    if (error) throw error;
    
    return data.path;
  } catch (error) {
    console.error('Error uploading invoice:', error);
    return null;
  }
};

export const downloadInvoice = async (path: string): Promise<void> => {
  try {
    const { data, error } = await supabase.storage
      .from('invoices')
      .download(path);

    if (error) throw error;
    
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = path.split('/').pop() || 'invoice';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  } catch (error) {
    console.error('Error downloading invoice:', error);
  }
};

export const exportTransactions = async (
  transactions: Transaction[],
  includeInvoices: boolean,
  startDate?: Date,
  endDate?: Date
): Promise<void> => {
  try {
    // Filter transactions by date range if provided
    let filteredTransactions = transactions;
    if (startDate || endDate) {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        if (startDate && endDate) {
          return transactionDate >= startDate && transactionDate <= endDate;
        } else if (startDate) {
          return transactionDate >= startDate;
        } else if (endDate) {
          return transactionDate <= endDate;
        }
        return true;
      });
    }

    // Prepare data for Excel
    const data = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type,
      Description: t.description,
      Amount: t.amount,
      VAT: t.vat,
      Total: t.totalAmount,
      Notes: t.notes || '',
      HasInvoice: t.invoicePath ? 'Yes' : 'No',
      'VAT Exempt': t.vatExempt ? 'Yes' : 'No'
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    // Save workbook
    const fileName = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    if (includeInvoices) {
      // Download invoices in parallel
      const invoicePromises = filteredTransactions
        .filter(t => t.invoicePath)
        .map(t => downloadInvoice(t.invoicePath!));
      await Promise.all(invoicePromises);
    }
  } catch (error) {
    console.error('Error exporting transactions:', error);
    throw error;
  }
};
