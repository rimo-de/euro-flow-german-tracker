
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TransactionAmountsProps {
  amount: string;
  setAmount: (amount: string) => void;
  manualVat: string;
  setManualVat: (vat: string) => void;
  vat: number;
  total: number;
  autoVat: boolean;
}

export const TransactionAmounts: React.FC<TransactionAmountsProps> = ({
  amount,
  setAmount,
  manualVat,
  setManualVat,
  vat,
  total,
  autoVat,
}) => {
  return (
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
          VAT {autoVat ? '(19% auto)' : '(manual)'} €
        </Label>
        {autoVat ? (
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
  );
};
