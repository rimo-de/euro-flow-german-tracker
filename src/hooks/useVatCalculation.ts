
import { useState, useMemo } from 'react';
import { calculateVAT, calculateGrossAmount } from "@/utils/financeUtils";

export const useVatCalculation = (initialAmount: string, initialVat: string, autoVat: boolean) => {
  const [amount, setAmount] = useState<string>(initialAmount);
  const [manualVat, setManualVat] = useState<string>(initialVat);

  const { vat, total } = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount))) {
      return { vat: 0, total: 0 };
    }
    
    const parsedAmount = parseFloat(amount);
    
    if (autoVat) {
      const calculatedVat = calculateVAT(parsedAmount);
      const total = calculateGrossAmount(parsedAmount);
      return { vat: calculatedVat, total };
    } else {
      const vat = parseFloat(manualVat) || 0;
      const total = parsedAmount + vat;
      return { vat, total };
    }
  }, [amount, manualVat, autoVat]);

  return {
    amount,
    setAmount,
    manualVat,
    setManualVat,
    vat,
    total
  };
};
