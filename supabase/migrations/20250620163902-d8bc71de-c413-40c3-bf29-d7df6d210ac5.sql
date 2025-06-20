
-- First, let's drop any existing problematic policies on the users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create a security definer function to get the current user's ID safely
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new RLS policies for the users table using the security definer function
CREATE POLICY "Users can view their own record" 
  ON public.users 
  FOR SELECT 
  USING (id = public.get_current_user_id());

CREATE POLICY "Users can update their own record" 
  ON public.users 
  FOR UPDATE 
  USING (id = public.get_current_user_id());

CREATE POLICY "Users can insert their own record" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (id = public.get_current_user_id());

-- Also ensure the profiles table has proper RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = public.get_current_user_id());

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (id = public.get_current_user_id());

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (id = public.get_current_user_id());

-- Ensure companies table has proper RLS policies that don't cause recursion
DROP POLICY IF EXISTS "Users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert companies" ON public.companies;

CREATE POLICY "Authenticated users can view companies" 
  ON public.companies 
  FOR SELECT 
  TO authenticated;

CREATE POLICY "Authenticated users can update companies" 
  ON public.companies 
  FOR UPDATE 
  TO authenticated;

CREATE POLICY "Authenticated users can insert companies" 
  ON public.companies 
  FOR INSERT 
  TO authenticated;
