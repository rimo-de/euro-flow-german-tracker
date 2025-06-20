
-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Enable RLS on companies table if not already enabled
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for companies table
-- Note: This assumes users can manage their own company data
-- You may need to adjust based on your business logic
CREATE POLICY "Users can view companies" 
  ON public.companies 
  FOR SELECT 
  TO authenticated;

CREATE POLICY "Users can update companies" 
  ON public.companies 
  FOR UPDATE 
  TO authenticated;

CREATE POLICY "Users can insert companies" 
  ON public.companies 
  FOR INSERT 
  TO authenticated;

-- Add company_id to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='company_id') THEN
    ALTER TABLE public.profiles ADD COLUMN company_id uuid REFERENCES public.companies(id);
  END IF;
END $$;
