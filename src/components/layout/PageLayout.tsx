
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold finance-gradient-text">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
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
