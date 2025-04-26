
import React, { useState } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/useSettingsContext";
import { useAuth } from "@/context/AuthContext";
import { uploadInvoice } from "@/utils/fileUtils";
import { TransactionBasicDetails } from "./TransactionBasicDetails";
import { TransactionAmounts } from "./TransactionAmounts";
import { TransactionRecurring } from "./TransactionRecurring";
import { useVatCalculation } from "@/hooks/useVatCalculation";

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
  const [type, setType] = useState(transaction?.type || "expense");
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || "");
  const [description, setDescription] = useState(transaction?.description || "");
  const [notes, setNotes] = useState(transaction?.notes || "");
  const [recurring, setRecurring] = useState(transaction?.recurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    transaction?.recurringFrequency || "monthly"
  );
  const [invoicePath, setInvoicePath] = useState(transaction?.invoicePath);
  const [file, setFile] = useState<File | null>(null);
  
  const { settings } = useSettings();
  const { user } = useAuth();

  const {
    amount,
    setAmount,
    manualVat,
    setManualVat,
    vat,
    total,
    vatExempt,
    setVatExempt
  } = useVatCalculation(
    transaction?.amount.toString() || "",
    transaction?.vat.toString() || "0",
    settings.autoVat,
    transaction?.vatExempt || false
  );

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
      vat: vatExempt ? 0 : settings.autoVat ? vat : parseFloat(manualVat) || 0,
      totalAmount: total,
      notes: notes.trim() || undefined,
      invoicePath: updatedInvoicePath,
      recurring,
      recurringFrequency: recurring ? recurringFrequency : undefined,
      vatExempt,
    };

    onSubmit(newTransaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TransactionBasicDetails
        date={date}
        setDate={setDate}
        type={type}
        setType={setType}
        description={description}
        setDescription={setDescription}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
      />

      <TransactionAmounts
        amount={amount}
        setAmount={setAmount}
        manualVat={manualVat}
        setManualVat={setManualVat}
        vat={vat}
        total={total}
        autoVat={settings.autoVat}
        vatExempt={vatExempt}
        setVatExempt={setVatExempt}
      />

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

      <TransactionRecurring
        recurring={recurring}
        setRecurring={setRecurring}
        recurringFrequency={recurringFrequency}
        setRecurringFrequency={setRecurringFrequency}
      />

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
