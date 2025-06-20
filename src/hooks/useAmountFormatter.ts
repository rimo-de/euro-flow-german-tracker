
import { useSettings } from "@/context/useSettingsContext";
import { formatAmount } from "@/utils/financeUtils";

export const useAmountFormatter = () => {
  const { settings } = useSettings();

  const formatAmountWithSettings = (amount: number): string => {
    return formatAmount(amount, settings.currencyDisplay);
  };

  return { formatAmountWithSettings };
};
