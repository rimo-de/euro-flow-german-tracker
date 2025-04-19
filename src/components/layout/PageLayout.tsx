
import React from "react";
import Navbar from "./Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Euro-Flow Tracker | Made for German Businesses
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
