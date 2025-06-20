
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useAccountData } from "@/hooks/useAccountData";
import { Loader2, Eye, EyeOff } from "lucide-react";

const accountFormSchema = z.object({
  firstName: z.string().optional().or(z.string().min(1, "First name must not be empty if provided")),
  lastName: z.string().optional().or(z.string().min(1, "Last name must not be empty if provided")),
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional().or(z.string().min(1, "Company name must not be empty if provided")),
  vatId: z.string().optional(),
  password: z.string().optional().or(z.string().min(6, "Password must be at least 6 characters")),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Only require password confirmation if a password is provided
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export const AccountForm = () => {
  const { user } = useAuth();
  const { profile, loading, saving, updateProfile, updateCompany, changePassword } = useAccountData();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      vatId: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile && user) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: user.email || "",
        companyName: profile.company?.name || "",
        vatId: profile.company?.vat_id || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [profile, user, form]);

  const onSubmit = async (values: AccountFormValues) => {
    if (!user) return;

    try {
      // Only update profile if profile fields have content
      const hasProfileChanges = values.firstName || values.lastName;
      if (hasProfileChanges) {
        await updateProfile({
          firstName: values.firstName || undefined,
          lastName: values.lastName || undefined,
        });
      }

      // Only update company if company fields have content
      const hasCompanyChanges = values.companyName;
      if (hasCompanyChanges) {
        await updateCompany({
          id: profile?.company?.id,
          name: values.companyName!,
          vatId: values.vatId || undefined,
        });
      }

      // Only change password if provided
      if (values.password && values.password.length > 0) {
        await changePassword(values.password);
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-finance-highlight" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Information (Optional)</h3>
          <p className="text-sm text-gray-600">Update only the fields you want to change. Leave fields empty to keep current values.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Leave empty to keep current" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Leave empty to keep current" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Leave empty to keep current" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="vatId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID (USt-IdNr.)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="DE123456789 (optional)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">Change Password (Optional)</h3>
          <p className="text-sm text-gray-600">Leave password fields empty if you don't want to change your password.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"}
                        placeholder="Leave blank to keep current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="hover-scale" 
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Account Information"
          )}
        </Button>
      </form>
    </Form>
  );
};
