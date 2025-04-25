
import React, { useState, useEffect } from "react";
import { Transaction, CategoryType, TransactionType } from "@/types/finance";
import { calculateVAT, calculateGrossAmount } from "@/utils/financeUtils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettings } from "@/context/useSettingsContext";
import { uploadInvoice } from "@/utils/fileUtils";
import { useAuth } from "@/context/AuthContext";

interface TransactionFormProps {
  transaction?: Transaction;
  categories: CategoryType[];
  onSubmit: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [date, setDate] = useState<string>(
    transaction
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [type, setType] = useState<TransactionType>(
    transaction ? transaction.type : "expense"
  );
  const [categoryId, setCategoryId] = useState<string>(
    transaction ? transaction.categoryId : ""
  );
  const [description, setDescription] = useState<string>(
    transaction ? transaction.description : ""
  );
  const [amount, setAmount] = useState<string>(
    transaction ? transaction.amount.toString() : ""
  );
  const [manualVat, setManualVat] = useState<string>(
    transaction ? transaction.vat.toString() : "0"
  );
  const [notes, setNotes] = useState<string>(transaction?.notes || "");
  const [recurring, setRecurring] = useState<boolean>(
    transaction ? !!transaction.recurring : false
  );
  const [recurringFrequency, setRecurringFrequency] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >(transaction?.recurringFrequency || "monthly");
  const [invoicePath, setInvoicePath] = useState<string | undefined>(
    transaction?.invoicePath
  );
  const [file, setFile] = useState<File | null>(null);
  const { settings } = useSettings();
  const { user } = useAuth();

  // Calculate VAT and total based on settings
  const calculateVatAndTotal = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return { vat: 0, total: 0 };
    }
    
    const parsedAmount = parseFloat(amount);
    
    if (settings.autoVat) {
      const vat = calculateVAT(parsedAmount);
      const total = calculateGrossAmount(parsedAmount);
      return { vat, total };
    } else {
      const vat = parseFloat(manualVat) || 0;
      const total = parsedAmount + vat;
      return { vat, total };
    }
  };
  
  const { vat, total } = calculateVatAndTotal();

  const filteredCategories = categories.filter(
    (category) => category.type === "both" || category.type === type
  );

  useEffect(() => {
    if (!categoryId && filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [categoryId, filteredCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId || !description || !amount || !user) {
      alert("Please fill in all required fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    let updatedInvoicePath = transaction?.invoicePath;
    if (file) {
      updatedInvoicePath = await uploadInvoice(file, user.id);
    }

    const newTransaction: Omit<Transaction, "id" | "createdAt" | "updatedAt"> = {
      date: new Date(date),
      type,
      categoryId,
      description,
      amount: parsedAmount,
      vat: settings.autoVat ? vat : parseFloat(manualVat) || 0,
      totalAmount: total,
      notes: notes.trim() || undefined,
      invoicePath: updatedInvoicePath,
      recurring,
      recurringFrequency: recurring ? recurringFrequency : undefined,
    };

    onSubmit(newTransaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select value={type} onValueChange={(value: TransactionType) => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={categoryId}
            onValueChange={(value) => setCategoryId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (Net) €</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vat">
            VAT {settings.autoVat ? '(19% auto)' : '(manual)'} €
          </Label>
          {settings.autoVat ? (
            <Input id="vat" type="number" step="0.01" value={vat} disabled />
          ) : (
            <Input 
              id="vat" 
              type="number" 
              step="0.01" 
              min="0" 
              value={manualVat} 
              onChange={(e) => setManualVat(e.target.value)}
              placeholder="0.00"
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="total">Total (Gross) €</Label>
          <Input id="total" type="number" step="0.01" value={total} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes here"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice">Upload Invoice (Optional)</Label>
        <Input
          id="invoice"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {transaction?.invoicePath && (
          <p className="text-sm text-gray-500">
            Current invoice: {transaction.invoicePath.split('/').pop()}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={recurring}
            onCheckedChange={(checked) => setRecurring(checked as boolean)}
          />
          <Label htmlFor="recurring" className="cursor-pointer">
            This is a recurring transaction
          </Label>
        </div>

        {recurring && (
          <div className="pl-6">
            <Label htmlFor="recurringFrequency">Frequency</Label>
            <Select
              value={recurringFrequency}
              onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") =>
                setRecurringFrequency(value)
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-finance-highlight hover:bg-finance-highlight/90">
          {transaction ? "Update Transaction" : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
