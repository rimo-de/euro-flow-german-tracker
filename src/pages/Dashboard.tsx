
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SummaryCard from "@/components/dashboard/SummaryCard";
import FinanceChart from "@/components/dashboard/FinanceChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, getMonthName, calculateTotal } from "@/utils/financeUtils";
import { ChartData } from "@/types/finance";
import { Euro, ArrowDown, ArrowUp, Receipt, FileText } from "lucide-react";

const Dashboard = () => {
  const { transactions, categories } = useFinance();
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [categoryExpenseData, setCategoryExpenseData] = useState<any[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState({
    revenue: 0,
    expense: 0,
    balance: 0,
    changePercentage: 0,
  });

  // Prepare monthly data for charts
  useEffect(() => {
    if (transactions.length === 0) return;

    // Get unique months from transactions
    const now = new Date();
    const lastSixMonths: { month: number; year: number }[] = [];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      lastSixMonths.unshift({ 
        month: date.getMonth(), 
        year: date.getFullYear() 
      });
    }

    // Create chart data
    const chartData = lastSixMonths.map(({ month, year }) => {
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      });

      const revenue = monthTransactions
        .filter(t => t.type === "revenue")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: `${getMonthName(month).substring(0, 3)} ${year}`,
        revenue,
        expense,
        balance: revenue - expense,
      };
    });

    setMonthlyData(chartData);

    // Calculate current month and previous month totals
    const currentMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    
    if (currentMonth && previousMonth) {
      const changePercentage = previousMonth.balance !== 0 
        ? ((currentMonth.balance - previousMonth.balance) / Math.abs(previousMonth.balance)) * 100 
        : 100;
      
      setMonthlyTotals({
        revenue: currentMonth.revenue,
        expense: currentMonth.expense,
        balance: currentMonth.balance,
        changePercentage: parseFloat(changePercentage.toFixed(1)),
      });
    }
  }, [transactions]);

  // Prepare category data for pie chart
  useEffect(() => {
    if (transactions.length === 0 || categories.length === 0) return;

    // Get expenses by category
    const expensesByCategory = categories
      .filter(c => c.type === "expense" || c.type === "both")
      .map(category => {
        const categoryTransactions = transactions.filter(
          t => t.type === "expense" && t.categoryId === category.id
        );
        
        const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: category.name,
          value: total,
          color: category.color || "#9CA3AF",
        };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    setCategoryExpenseData(expensesByCategory);
  }, [transactions, categories]);

  return (
    <PageLayout 
      title="Finance Dashboard" 
      subtitle="Overview of your business finances"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Current Balance" 
          value={formatCurrency(monthlyTotals.balance)}
          change={monthlyTotals.changePercentage}
          icon={<Euro className="h-5 w-5" />}
          className={monthlyTotals.balance >= 0 ? "border-l-4 border-finance-positive" : "border-l-4 border-finance-negative"}
        />
        <SummaryCard 
          title="Monthly Revenue" 
          value={formatCurrency(monthlyTotals.revenue)}
          icon={<ArrowUp className="h-5 w-5" />}
          className="border-l-4 border-finance-positive"
        />
        <SummaryCard 
          title="Monthly Expenses" 
          value={formatCurrency(monthlyTotals.expense)}
          icon={<ArrowDown className="h-5 w-5" />}
          className="border-l-4 border-finance-negative"
        />
        <SummaryCard 
          title="Total Transactions" 
          value={transactions.length.toString()}
          icon={<Receipt className="h-5 w-5" />}
          className="border-l-4 border-gray-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <FinanceChart 
            data={monthlyData} 
            title="Revenue & Expenses (Last 6 Months)" 
          />
        </div>
        <div>
          <CategoryPieChart 
            data={categoryExpenseData} 
            title="Expenses by Category" 
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="finance-card">
        <h3 className="text-gray-700 font-medium mb-4">Quick Stats</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg finance-shadow">
            <p className="text-sm text-gray-500">Total Revenue (YTD)</p>
            <p className="text-xl font-semibold finance-positive mt-1">
              {formatCurrency(
                transactions
                  .filter(t => t.type === "revenue" && new Date(t.date).getFullYear() === new Date().getFullYear())
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg finance-shadow">
            <p className="text-sm text-gray-500">Total Expenses (YTD)</p>
            <p className="text-xl font-semibold finance-negative mt-1">
              {formatCurrency(
                transactions
                  .filter(t => t.type === "expense" && new Date(t.date).getFullYear() === new Date().getFullYear())
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg finance-shadow">
            <p className="text-sm text-gray-500">Total VAT Paid</p>
            <p className="text-xl font-semibold text-gray-700 mt-1">
              {formatCurrency(
                transactions
                  .filter(t => t.type === "expense")
                  .reduce((sum, t) => sum + t.vat, 0)
              )}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg finance-shadow">
            <p className="text-sm text-gray-500">Total VAT Collected</p>
            <p className="text-xl font-semibold text-gray-700 mt-1">
              {formatCurrency(
                transactions
                  .filter(t => t.type === "revenue")
                  .reduce((sum, t) => sum + t.vat, 0)
              )}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
