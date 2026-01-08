-- Create table for anonymous messages
CREATE TABLE public.anonymous_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  message_code TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 8)
);

-- Enable RLS
ALTER TABLE public.anonymous_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit anonymous messages
CREATE POLICY "Anyone can submit anonymous messages"
ON public.anonymous_messages
FOR INSERT
WITH CHECK (true);

-- Anyone can view messages by code (for checking replies)
CREATE POLICY "Anyone can view messages by code"
ON public.anonymous_messages
FOR SELECT
USING (true);

-- Admins can manage all messages
CREATE POLICY "Admins can manage anonymous messages"
ON public.anonymous_messages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));