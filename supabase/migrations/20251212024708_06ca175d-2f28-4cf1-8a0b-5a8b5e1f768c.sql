-- Create table for VIS AI saved data
CREATE TABLE public.vis_ai_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vis_ai_data ENABLE ROW LEVEL SECURITY;

-- Allow public to insert data (anyone can save via /@add)
CREATE POLICY "Anyone can add data" 
ON public.vis_ai_data 
FOR INSERT 
WITH CHECK (true);

-- Allow public to read data (AI needs to access saved data)
CREATE POLICY "Anyone can read data" 
ON public.vis_ai_data 
FOR SELECT 
USING (true);

-- Allow admins to delete data
CREATE POLICY "Admins can delete data" 
ON public.vis_ai_data 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));