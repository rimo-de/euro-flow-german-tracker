
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TransactionSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
