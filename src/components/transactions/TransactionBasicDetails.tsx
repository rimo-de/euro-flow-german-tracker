
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryType, TransactionType } from "@/types/finance";

interface TransactionBasicDetailsProps {
  date: string;
  setDate: (date: string) => void;
  type: TransactionType;
  setType: (type: TransactionType) => void;
  description: string;
  setDescription: (description: string) => void;
  categoryId: string;
  setCategoryId: (categoryId: string) => void;
  categories: CategoryType[];
}

export const TransactionBasicDetails: React.FC<TransactionBasicDetailsProps> = ({
  date,
  setDate,
  type,
  setType,
  description,
  setDescription,
  categoryId,
  setCategoryId,
  categories,
}) => {
  const filteredCategories = categories.filter(
    (category) => category.type === "both" || category.type === type
  );

  return (
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
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
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
  );
};
