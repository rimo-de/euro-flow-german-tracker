
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useFinance } from "@/context/FinanceContext";
import { formatDate } from "@/utils/financeUtils";
import { useAmountFormatter } from "@/hooks/useAmountFormatter";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, FilePlus } from "lucide-react";
import { Label } from "@/components/ui/label";

const Reports = () => {
  const { transactions, categories } = useFinance();
  const { formatAmountWithSettings } = useAmountFormatter();
  const [reportType, setReportType] = useState("profit-loss");
  const [timeframe, setTimeframe] = useState("month");
  
  // Get current year and month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Filter transactions based on timeframe
  const getFilteredTransactions = () => {
    const startDate = new Date();
    
    if (timeframe === "month") {
      startDate.setMonth(currentMonth);
      startDate.setDate(1);
    } else if (timeframe === "quarter") {
      startDate.setMonth(Math.floor(currentMonth / 3) * 3);
      startDate.setDate(1);
    } else if (timeframe === "year") {
      startDate.setMonth(0);
      startDate.setDate(1);
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate totals - expenses use totalAmount (including VAT), revenue uses amount
  const totalRevenue = filteredTransactions
    .filter(t => t.type === "revenue")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.totalAmount, 0);
    
  const totalVatCollected = filteredTransactions
    .filter(t => t.type === "revenue")
    .reduce((sum, t) => sum + t.vat, 0);
    
  const totalVatPaid = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.vat, 0);
  
  // Group expenses by category - use totalAmount for actual payment amounts
  const expensesByCategory = categories
    .filter(c => c.type === "expense" || c.type === "both")
    .map(category => {
      const categoryTransactions = filteredTransactions.filter(
        t => t.type === "expense" && t.categoryId === category.id
      );
      
      const total = categoryTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
      
      return {
        name: category.name,
        amount: total,
        color: category.color,
      };
    })
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  
  // Group revenue by category
  const revenueByCategory = categories
    .filter(c => c.type === "revenue" || c.type === "both")
    .map(category => {
      const categoryTransactions = filteredTransactions.filter(
        t => t.type === "revenue" && t.categoryId === category.id
      );
      
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        amount: total,
        color: category.color,
      };
    })
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const handleExport = (format: "excel" | "csv" | "pdf") => {
    // This is a placeholder for export functionality
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}. This feature will be implemented in a future update.`);
  };

  // Time frame label formatting
  const getTimeframeLabel = () => {
    if (timeframe === "month") {
      return `${new Date(currentYear, currentMonth).toLocaleString('de-DE', { month: 'long', year: 'numeric' })}`;
    } else if (timeframe === "quarter") {
      const quarter = Math.floor(currentMonth / 3) + 1;
      return `Q${quarter} ${currentYear}`;
    } else {
      return currentYear.toString();
    }
  };

  return (
    <PageLayout 
      title="Financial Reports" 
      subtitle="Generate and export financial reports"
    >
      {/* Report Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select
              value={reportType}
              onValueChange={setReportType}
            >
              <SelectTrigger id="report-type" className="mt-1">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profit-loss">Profit & Loss Statement</SelectItem>
                <SelectItem value="vat-summary">VAT Summary</SelectItem>
                <SelectItem value="expense-breakdown">Expense Breakdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="time-frame">Time Frame</Label>
            <Select
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <SelectTrigger id="time-frame" className="mt-1">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Current Month</SelectItem>
                <SelectItem value="quarter">Current Quarter</SelectItem>
                <SelectItem value="year">Current Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="lg:col-span-2 flex items-end space-x-2">
            <Button
              onClick={() => handleExport("excel")}
              variant="outline"
              className="flex-1"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button
              onClick={() => handleExport("csv")}
              variant="outline"
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => handleExport("pdf")}
              variant="outline"
              className="flex-1"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {reportType === "profit-loss" && "Profit & Loss Statement"}
            {reportType === "vat-summary" && "VAT Summary Report"}
            {reportType === "expense-breakdown" && "Expense Breakdown"}
          </h2>
          <p className="text-gray-600">For period: {getTimeframeLabel()}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <Tabs defaultValue={reportType} value={reportType} onValueChange={setReportType}>
            <TabsList className="mb-4">
              <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
              <TabsTrigger value="vat-summary">VAT Summary</TabsTrigger>
              <TabsTrigger value="expense-breakdown">Expense Breakdown</TabsTrigger>
            </TabsList>
            
            {/* Profit & Loss Tab */}
            <TabsContent value="profit-loss">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Revenue</h3>
                  <div className="space-y-2">
                    {revenueByCategory.map((category, index) => (
                      <div key={index} className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <div
                            className="h-4 w-4 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium text-green-600">{formatAmountWithSettings(category.amount)}</span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center px-4 py-2 bg-green-50 rounded font-medium">
                      <span>Total Revenue</span>
                      <span className="text-green-600">{formatAmountWithSettings(totalRevenue)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Expenses (incl. VAT)</h3>
                  <div className="space-y-2">
                    {expensesByCategory.map((category, index) => (
                      <div key={index} className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <div
                            className="h-4 w-4 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium text-red-600">{formatAmountWithSettings(category.amount)}</span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center px-4 py-2 bg-red-50 rounded font-medium">
                      <span>Total Expenses (incl. VAT)</span>
                      <span className="text-red-600">{formatAmountWithSettings(totalExpenses)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded font-bold text-lg">
                    <span>Net Profit/Loss</span>
                    <span className={totalRevenue - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatAmountWithSettings(totalRevenue - totalExpenses)}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* VAT Summary Tab */}
            <TabsContent value="vat-summary">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">VAT Collected (Output VAT)</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">{formatAmountWithSettings(totalVatCollected)}</div>
                    <p className="text-gray-500">From revenue transactions</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">VAT Paid (Input VAT)</h3>
                    <div className="text-3xl font-bold text-red-600 mb-2">{formatAmountWithSettings(totalVatPaid)}</div>
                    <p className="text-gray-500">From expense transactions</p>
                  </Card>
                </div>
                
                <Card className="p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">VAT Balance (To Pay/Refund)</h3>
                  <div className={`text-3xl font-bold mb-2 ${totalVatCollected - totalVatPaid > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatAmountWithSettings(totalVatCollected - totalVatPaid)}
                  </div>
                  <p className="text-gray-500">
                    {totalVatCollected - totalVatPaid > 0 
                      ? "Amount to pay to tax authorities" 
                      : "Refund amount from tax authorities"}
                  </p>
                </Card>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">VAT Report Summary</h3>
                  <p className="text-blue-600 mb-4">For the period: {getTimeframeLabel()}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">VAT Rate:</span>
                      <span className="font-medium">19%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Taxable Amount:</span>
                      <span className="font-medium">{formatAmountWithSettings(totalRevenue + totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Number of Transactions:</span>
                      <span className="font-medium">{filteredTransactions.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Expense Breakdown Tab - now shows total amounts including VAT */}
            <TabsContent value="expense-breakdown">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Expense Categories (Total Amount Paid incl. VAT)</h3>
                
                {expensesByCategory.length > 0 ? (
                  <div className="space-y-3">
                    {expensesByCategory.map((category, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-3">
                          <div className="flex items-center">
                            <div
                              className="h-4 w-4 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="font-bold">{formatAmountWithSettings(category.amount)}</span>
                        </div>
                        <div className="h-2 w-full" style={{ 
                          width: `${(category.amount / totalExpenses) * 100}%`,
                          backgroundColor: category.color,
                          minWidth: "10px"
                        }}></div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded font-bold">
                        <span>Total Expenses (incl. VAT)</span>
                        <span className="text-red-600">{formatAmountWithSettings(totalExpenses)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No expense data available for the selected period
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reports;
