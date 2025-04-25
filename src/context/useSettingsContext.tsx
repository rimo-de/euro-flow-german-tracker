
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
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          autoVat: data.auto_vat,
          autoBackup: data.auto_backup,
          currencyDisplay: data.currency_display,
          manualVat: data.manual_vat,
        });
      } else {
        // Create default settings for new user
        const { error: insertError } = await supabase
          .from("settings")
          .insert({
            user_id: user?.id,
            auto_vat: true,
            auto_backup: true,
            currency_display: true,
            manual_vat: false,
          });

        if (insertError) throw insertError;
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

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updates = {
        ...(newSettings.autoVat !== undefined && { auto_vat: newSettings.autoVat }),
        ...(newSettings.autoBackup !== undefined && { auto_backup: newSettings.autoBackup }),
        ...(newSettings.currencyDisplay !== undefined && { currency_display: newSettings.currencyDisplay }),
        ...(newSettings.manualVat !== undefined && { manual_vat: newSettings.manualVat }),
      };

      const { error } = await supabase
        .from("settings")
        .update(updates)
        .eq("user_id", user?.id);

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
