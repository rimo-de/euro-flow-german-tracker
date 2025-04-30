
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/useSettingsContext";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { settings, updateSettings, loading } = useSettings();

  if (loading) {
    return (
      <PageLayout title="Settings" subtitle="Configure your finance tracker settings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-finance-highlight" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Settings" subtitle="Configure your finance tracker settings">
      <div className="space-y-6">
        <Card className="finance-shadow">
          <CardHeader>
            <CardTitle className="finance-gradient-text">General Settings</CardTitle>
            <CardDescription>Configure general application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-vat" className="text-base">Automatic VAT Calculation</Label>
                <p className="text-sm text-gray-500">
                  Automatically calculate VAT (19%) for transactions. You can still mark specific transactions as VAT exempt.
                </p>
              </div>
              <Switch
                id="auto-vat"
                checked={settings.autoVat}
                onCheckedChange={(checked) => updateSettings({ autoVat: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-backup" className="text-base">Automatic Backups</Label>
                <p className="text-sm text-gray-500">Create automatic backups of your financial data</p>
              </div>
              <Switch
                id="auto-backup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => updateSettings({ autoBackup: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="currency-display" className="text-base">Currency Display</Label>
                <p className="text-sm text-gray-500">Show all amounts with currency symbol</p>
              </div>
              <Switch
                id="currency-display"
                checked={settings.currencyDisplay}
                onCheckedChange={(checked) => updateSettings({ currencyDisplay: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="finance-shadow">
          <CardHeader>
            <CardTitle className="finance-gradient-text">Account Settings</CardTitle>
            <CardDescription>
              Manage your user account and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Your Company Name" defaultValue="My German Business" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID (USt-IdNr.)</Label>
                <Input id="tax-id" placeholder="DE123456789" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value="************" />
              </div>
            </div>

            <Button variant="outline" className="hover-scale">Update Account Information</Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="finance-shadow">
          <CardHeader>
            <CardTitle className="finance-gradient-text">Data Management</CardTitle>
            <CardDescription>
              Manage your financial data and backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg finance-shadow">
              <div>
                <h3 className="font-medium">Database Backup</h3>
                <p className="text-sm text-gray-500">Last backup: Today at 08:30</p>
              </div>
              <Button variant="outline" className="hover-scale">Create Backup</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg finance-shadow">
              <div>
                <h3 className="font-medium">Import Data</h3>
                <p className="text-sm text-gray-500">Import data from Excel, CSV or JSON</p>
              </div>
              <Button variant="outline" className="hover-scale">Import</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg finance-shadow">
              <div>
                <h3 className="font-medium">Export All Data</h3>
                <p className="text-sm text-gray-500">Export all financial data</p>
              </div>
              <Button variant="outline" className="hover-scale">Export</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg finance-shadow">
              <div>
                <h3 className="font-medium text-red-800">Delete All Data</h3>
                <p className="text-sm text-red-600">This action cannot be undone</p>
              </div>
              <Button variant="destructive" className="hover-scale">Delete All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Settings;
