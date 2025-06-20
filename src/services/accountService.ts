
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type CompanyRow = Database['public']['Tables']['companies']['Row'];
type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  companyId?: string;
  company?: CompanyRow;
}

export interface CompanyInfo {
  id?: string;
  name: string;
  vatId?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export const accountService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      firstName: data.first_name || undefined,
      lastName: data.last_name || undefined,
      companyId: data.company_id || undefined,
      company: data.company || undefined
    };
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    const updateData: ProfileUpdate = {};
    
    if (profile.firstName !== undefined) updateData.first_name = profile.firstName;
    if (profile.lastName !== undefined) updateData.last_name = profile.lastName;
    if (profile.companyId !== undefined) updateData.company_id = profile.companyId;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  async createOrUpdateCompany(companyData: CompanyInfo, userId: string): Promise<string> {
    if (companyData.id) {
      // Update existing company
      const { error } = await supabase
        .from('companies')
        .update({
          name: companyData.name,
          vat_id: companyData.vatId,
          address: companyData.address,
          city: companyData.city,
          postal_code: companyData.postalCode,
          country: companyData.country,
          phone: companyData.phone,
          email: companyData.email,
          website: companyData.website
        })
        .eq('id', companyData.id);

      if (error) {
        throw new Error(`Failed to update company: ${error.message}`);
      }
      return companyData.id;
    } else {
      // Create new company
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          vat_id: companyData.vatId,
          address: companyData.address,
          city: companyData.city,
          postal_code: companyData.postalCode,
          country: companyData.country,
          phone: companyData.phone,
          email: companyData.email,
          website: companyData.website
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create company: ${error.message}`);
      }
      return data.id;
    }
  },

  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }
};
