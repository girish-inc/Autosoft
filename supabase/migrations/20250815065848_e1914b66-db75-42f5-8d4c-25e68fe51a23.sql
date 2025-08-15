-- Fix infinite recursion in RLS policies by creating a security definer function
-- and restructuring the policies

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins and managers can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Inventory managers and admins can manage vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Sales team and above can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Sales team and above can manage sales" ON public.sales;

-- Create a security definer function to get user role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recreate policies using the security definer function
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'super_admin');

CREATE POLICY "Super admins and managers can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.get_current_user_role() IN ('super_admin', 'manager'));

-- Fix vehicles policies
CREATE POLICY "Inventory managers and admins can manage vehicles" 
ON public.vehicles 
FOR ALL 
USING (public.get_current_user_role() IN ('super_admin', 'manager', 'inventory'));

-- Fix customers policies  
CREATE POLICY "Sales team and above can manage customers" 
ON public.customers 
FOR ALL 
USING (public.get_current_user_role() IN ('super_admin', 'manager', 'sales', 'receptionist'));

-- Fix sales policies
CREATE POLICY "Sales team and above can manage sales" 
ON public.sales 
FOR ALL 
USING (public.get_current_user_role() IN ('super_admin', 'manager', 'sales'));