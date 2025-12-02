-- Create user roles system for admin authentication
-- This creates a secure role-based access control system

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    role public.app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (bypasses RLS to prevent recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create RLS policies for user_roles table
-- Users can view their own role
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger to update updated_at timestamp
CREATE TRIGGER set_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Grant execute permission on the has_role function to authenticated users
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

COMMENT ON TABLE public.user_roles IS 'Stores user role assignments for access control';
COMMENT ON FUNCTION public.has_role IS 'Security definer function to check if a user has a specific role, used in RLS policies';