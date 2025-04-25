
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/finance";

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
  includeInvoices: boolean
): Promise<void> => {
  const csv = transactions.map(t => ({
    Date: new Date(t.date).toLocaleDateString(),
    Type: t.type,
    Description: t.description,
    Amount: t.amount,
    VAT: t.vat,
    Total: t.totalAmount,
    Notes: t.notes || '',
    HasInvoice: t.invoicePath ? 'Yes' : 'No'
  }));

  const csvContent = `data:text/csv;charset=utf-8,${
    Object.keys(csv[0]).join(',')}\n${
    csv.map(row => Object.values(row).join(',')).join('\n')}`;

  const link = document.createElement('a');
  link.href = encodeURI(csvContent);
  link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (includeInvoices) {
    // Download invoices in parallel
    const invoicePromises = transactions
      .filter(t => t.invoicePath)
      .map(t => downloadInvoice(t.invoicePath!));
    await Promise.all(invoicePromises);
  }
};
