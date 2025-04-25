
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionRecurringProps {
  recurring: boolean;
  setRecurring: (recurring: boolean) => void;
  recurringFrequency: "daily" | "weekly" | "monthly" | "yearly";
  setRecurringFrequency: (frequency: "daily" | "weekly" | "monthly" | "yearly") => void;
}

export const TransactionRecurring: React.FC<TransactionRecurringProps> = ({
  recurring,
  setRecurring,
  recurringFrequency,
  setRecurringFrequency,
}) => {
  return (
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
  );
};
