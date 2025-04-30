import React from "react";
import { Link } from "react-router-dom";
import { ChartBar, FolderOpen, Receipt, Settings, FileSpreadsheet } from "lucide-react";
const Navbar = () => {
  return <nav className="bg-white border-b border-gray-200 fixed w-full z-30 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">Finance</span>
              <span className="ml-2 text-finance-highlight font-bold">Tracker</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="flex items-center text-gray-600 hover:text-finance-highlight px-2 py-1 rounded-md hover:bg-gray-50">
              <ChartBar className="mr-1 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/transactions" className="flex items-center text-gray-600 hover:text-finance-highlight px-2 py-1 rounded-md hover:bg-gray-50">
              <Receipt className="mr-1 h-5 w-5" />
              <span>Transactions</span>
            </Link>
            <Link to="/categories" className="flex items-center text-gray-600 hover:text-finance-highlight px-2 py-1 rounded-md hover:bg-gray-50">
              <FolderOpen className="mr-1 h-5 w-5" />
              <span>Categories</span>
            </Link>
            <Link to="/reports" className="flex items-center text-gray-600 hover:text-finance-highlight px-2 py-1 rounded-md hover:bg-gray-50">
              <FileSpreadsheet className="mr-1 h-5 w-5" />
              <span>Reports</span>
            </Link>
            <Link to="/settings" className="flex items-center text-gray-600 hover:text-finance-highlight px-2 py-1 rounded-md hover:bg-gray-50">
              <Settings className="mr-1 h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
          
          <div className="flex md:hidden">
            <button className="text-gray-600 hover:text-finance-highlight focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - hidden by default */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-finance-highlight hover:bg-gray-50">Dashboard</Link>
          <Link to="/transactions" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-finance-highlight hover:bg-gray-50">Transactions</Link>
          <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-finance-highlight hover:bg-gray-50">Categories</Link>
          <Link to="/reports" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-finance-highlight hover:bg-gray-50">Reports</Link>
          <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-finance-highlight hover:bg-gray-50">Settings</Link>
        </div>
      </div>
    </nav>;
};
export default Navbar;