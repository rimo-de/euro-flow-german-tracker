
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionAmountsProps {
  amount: string;
  setAmount: (amount: string) => void;
  manualVat: string;
  setManualVat: (vat: string) => void;
  vat: number;
  total: number;
  autoVat: boolean;
  vatExempt: boolean;
  setVatExempt: (exempt: boolean) => void;
}

export const TransactionAmounts: React.FC<TransactionAmountsProps> = ({
  amount,
  setAmount,
  manualVat,
  setManualVat,
  vat,
  total,
  autoVat,
  vatExempt,
  setVatExempt,
}) => {
  return (
    <div className="space-y-4">
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
            VAT {autoVat && !vatExempt ? '(19% auto)' : vatExempt ? '(exempt)' : '(manual)'} €
          </Label>
          {autoVat && !vatExempt ? (
            <Input id="vat" type="number" step="0.01" value={vat} disabled />
          ) : vatExempt ? (
            <Input id="vat" type="number" step="0.01" value="0" disabled />
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
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="vat-exempt" 
          checked={vatExempt} 
          onCheckedChange={(checked) => setVatExempt(checked === true)}
        />
        <Label htmlFor="vat-exempt" className="text-sm font-normal">
          This transaction is VAT exempt
        </Label>
      </div>
    </div>
  );
};
