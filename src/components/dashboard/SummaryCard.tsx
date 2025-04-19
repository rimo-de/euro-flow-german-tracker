
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  className = "",
}) => {
  const isPositive = change && change > 0;
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        
        {change !== undefined && (
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${isPositive ? 'text-finance-positive' : 'text-finance-negative'}`}>
              {isPositive ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400 ml-1">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
