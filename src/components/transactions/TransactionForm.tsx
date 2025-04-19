
import React, { useState, useEffect } from "react";
import { Transaction, CategoryType, TransactionType } from "@/types/finance";
import { calculateVAT, calculateGrossAmount } from "@/utils/financeUtils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Calculate VAT and total
  const vat = amount ? calculateVAT(parseFloat(amount)) : 0;
  const total = amount ? calculateGrossAmount(parseFloat(amount)) : 0;

  // Filter categories based on type
  const filteredCategories = categories.filter(
    (category) => category.type === "both" || category.type === type
  );

  // Set default category if none selected
  useEffect(() => {
    if (!categoryId && filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [categoryId, filteredCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId || !description || !amount) {
      alert("Please fill in all required fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const newTransaction: Omit<Transaction, "id" | "createdAt" | "updatedAt"> = {
      date: new Date(date),
      type,
      categoryId,
      description,
      amount: parsedAmount,
      vat,
      totalAmount: total,
      notes: notes.trim() || undefined,
      invoicePath,
      recurring,
      recurringFrequency: recurring ? recurringFrequency : undefined,
    };

    onSubmit(newTransaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date and Type */}
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

      {/* Category and Description */}
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

      {/* Amount */}
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
          <Label htmlFor="vat">VAT (19%) €</Label>
          <Input id="vat" type="number" step="0.01" value={vat} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total">Total (Gross) €</Label>
          <Input id="total" type="number" step="0.01" value={total} disabled />
        </div>
      </div>

      {/* Notes */}
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

      {/* Invoice Upload - Placeholder functionality */}
      <div className="space-y-2">
        <Label htmlFor="invoice">Upload Invoice (Optional)</Label>
        <Input id="invoice" type="file" disabled className="cursor-not-allowed" />
        <p className="text-xs text-gray-500">
          Invoice upload functionality will be implemented in a future update
        </p>
      </div>

      {/* Recurring Transaction */}
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

      {/* Form Actions */}
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
