
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChartBar, FolderOpen, Receipt, Settings, FileSpreadsheet, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartBar,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Receipt,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: FolderOpen,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileSpreadsheet,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">Finance</span>
            <span className="ml-2 finance-gradient-text font-bold">Tracker</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url === "/dashboard" && location.pathname === "/");
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
          <User className="h-4 w-4" />
          <span>{user?.email || "Demo User"}</span>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          Euro-Flow Tracker
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
