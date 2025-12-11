-- Create school_rules table for editable rules
CREATE TABLE public.school_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parent_resources table for downloadable resources
CREATE TABLE public.parent_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'campus',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admission_forms table
CREATE TABLE public.admission_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  class_applying TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  address TEXT NOT NULL,
  previous_school TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_forms table
CREATE TABLE public.contact_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.school_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_forms ENABLE ROW LEVEL SECURITY;

-- Public read policies for public content
CREATE POLICY "Anyone can view active school rules" 
ON public.school_rules 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active parent resources" 
ON public.parent_resources 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (true);

-- Public insert policies for form submissions
CREATE POLICY "Anyone can submit admission forms" 
ON public.admission_forms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit contact forms" 
ON public.contact_forms 
FOR INSERT 
WITH CHECK (true);

-- Create user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin policies for full CRUD access
CREATE POLICY "Admins can manage school rules" 
ON public.school_rules 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage parent resources" 
ON public.parent_resources 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage gallery images" 
ON public.gallery_images 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view admission forms" 
ON public.admission_forms 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete admission forms" 
ON public.admission_forms 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view contact forms" 
ON public.contact_forms 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact forms" 
ON public.contact_forms 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policies
CREATE POLICY "Anyone can view resources" 
ON storage.objects 
FOR SELECT 
USING (bucket_id IN ('resources', 'gallery'));

CREATE POLICY "Admins can upload resources" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id IN ('resources', 'gallery') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resources" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id IN ('resources', 'gallery') AND public.has_role(auth.uid(), 'admin'));

-- Insert default school rules
INSERT INTO public.school_rules (title, content, category, order_index) VALUES
('Punctuality', 'Students must arrive at school by 7:45 AM. Late arrivals must report to the office for a late slip.', 'attendance', 1),
('Uniform Policy', 'All students must wear the prescribed school uniform neatly. Shoes must be polished and hair properly groomed.', 'dress-code', 2),
('Mobile Phones', 'Mobile phones are strictly prohibited on campus. Devices found will be confiscated and returned only to parents.', 'conduct', 3),
('Homework', 'Students must complete and submit homework on time. Repeated failure will result in parent notification.', 'academics', 4),
('Respect', 'Students must show respect to teachers, staff, and fellow students at all times.', 'conduct', 5),
('Library Rules', 'Maintain silence in the library. Books must be returned within 14 days.', 'facilities', 6),
('Examination Conduct', 'Any form of cheating or malpractice during exams will result in immediate disqualification.', 'academics', 7),
('Leave Policy', 'Prior written application is required for leave. Emergency leave must be followed by a medical certificate if applicable.', 'attendance', 8);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_school_rules_updated_at
BEFORE UPDATE ON public.school_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();