
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChartBar, FolderOpen, Receipt, Settings, FileSpreadsheet, User } from "lucide-react";
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

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2">
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
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>Demo User</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Euro-Flow Tracker
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
