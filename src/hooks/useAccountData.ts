
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { accountService, UserProfile, CompanyInfo } from "@/services/accountService";
import { toast } from "@/components/ui/use-toast";

export const useAccountData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const profileData = await accountService.getUserProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Failed to load your account information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setSaving(true);
      await accountService.updateUserProfile(user.id, updates);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update your profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateCompany = async (companyData: CompanyInfo) => {
    if (!user) return;

    try {
      setSaving(true);
      const companyId = await accountService.createOrUpdateCompany(companyData, user.id);
      
      // Update profile with company ID if it's a new company
      if (!profile?.companyId) {
        await accountService.updateUserProfile(user.id, { companyId });
      }
      
      // Reload profile to get updated company data
      await loadProfile();
      
      toast({
        title: "Company updated",
        description: "Your company information has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating company:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update company information.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      setSaving(true);
      await accountService.changePassword(newPassword);
      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Password change failed",
        description: error.message || "Failed to change your password.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    updateProfile,
    updateCompany,
    changePassword,
    reload: loadProfile
  };
};
