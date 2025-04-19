
import React, { useState } from "react";
import { CategoryType, TransactionType } from "@/types/finance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFormProps {
  category?: CategoryType;
  onSubmit: (category: Omit<CategoryType, "id">) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState<string>(category ? category.name : "");
  const [type, setType] = useState<TransactionType | "both">(
    category ? category.type : "expense"
  );
  const [color, setColor] = useState<string>(
    category ? category.color || "#9b87f5" : "#9b87f5"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const newCategory: Omit<CategoryType, "id"> = {
      name: name.trim(),
      type,
      color,
    };

    onSubmit(newCategory);
  };

  // Predefined colors
  const colors = [
    "#F87171", // red
    "#FB923C", // orange
    "#FBBF24", // amber
    "#34D399", // green
    "#60A5FA", // blue
    "#A78BFA", // purple
    "#EC4899", // pink
    "#9b87f5", // finance highlight
    "#8B5CF6", // violet
    "#9CA3AF", // gray
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type</Label>
        <Select
          value={type}
          onValueChange={(value: TransactionType | "both") => setType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className={`h-8 w-8 rounded-full border-2 ${
                color === c ? "border-gray-800" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-finance-highlight hover:bg-finance-highlight/90">
          {category ? "Update Category" : "Add Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
