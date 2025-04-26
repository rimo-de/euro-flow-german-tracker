
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "@/types/settings";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

type SettingsContextType = {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>({
    autoVat: true,
    autoBackup: true,
    currencyDisplay: true,
    manualVat: false,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Only load settings if there's an authenticated user
    if (user) {
      console.log("Loading settings for user:", user.id);
      loadSettings();
    } else {
      // If no user, just set loading to false
      setLoading(false);
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      if (!user) {
        console.log("No authenticated user, skipping settings load");
        setLoading(false);
        return;
      }

      console.log("Fetching settings from database for user:", user.id);
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // Only throw if it's not a "no rows returned" error
        if (error.code !== "PGRST116") {
          throw error;
        }
        
        // If no settings found, create default settings for the user
        console.log("No settings found, creating defaults");
        await createDefaultSettings();
      } else if (data) {
        console.log("Settings loaded:", data);
        setSettings({
          autoVat: data.auto_vat,
          autoBackup: data.auto_backup,
          currencyDisplay: data.currency_display,
          manualVat: data.manual_vat,
        });
      }
    } catch (error: any) {
      console.error("Error loading settings:", error.message);
      toast({
        title: "Error loading settings",
        description: "There was a problem loading your settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      if (!user) return;
      
      const { error: insertError } = await supabase
        .from("settings")
        .insert({
          user_id: user.id,
          auto_vat: true,
          auto_backup: true,
          currency_display: true,
          manual_vat: false,
        });

      if (insertError) throw insertError;
      
      // Use default settings (already in state)
      console.log("Default settings created");
    } catch (error: any) {
      console.error("Error creating default settings:", error.message);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "You must be logged in to update settings.",
          variant: "destructive",
        });
        return;
      }

      const updates = {
        ...(newSettings.autoVat !== undefined && { auto_vat: newSettings.autoVat }),
        ...(newSettings.autoBackup !== undefined && { auto_backup: newSettings.autoBackup }),
        ...(newSettings.currencyDisplay !== undefined && { currency_display: newSettings.currencyDisplay }),
        ...(newSettings.manualVat !== undefined && { manual_vat: newSettings.manualVat }),
      };

      const { error } = await supabase
        .from("settings")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...newSettings }));
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error: any) {
      console.error("Error updating settings:", error.message);
      toast({
        title: "Error updating settings",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
