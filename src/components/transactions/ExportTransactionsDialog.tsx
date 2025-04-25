
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ExportTransactionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  includeInvoices: boolean;
  onIncludeInvoicesChange: (checked: boolean) => void;
  onExport: () => void;
}

export const ExportTransactionsDialog: React.FC<ExportTransactionsDialogProps> = ({
  isOpen,
  onOpenChange,
  includeInvoices,
  onIncludeInvoicesChange,
  onExport,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Transactions</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="include-invoices"
            checked={includeInvoices}
            onCheckedChange={(checked) => onIncludeInvoicesChange(checked as boolean)}
          />
          <Label htmlFor="include-invoices">Include attached invoices</Label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onExport}>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
