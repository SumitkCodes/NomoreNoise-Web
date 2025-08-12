-- Create a demo user for testing purposes
-- Note: In a production environment, this should be done through the Supabase Auth API
-- This is for demo/testing purposes only

-- First, let's create the complaints table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  noise_type TEXT NOT NULL,
  description TEXT NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('low', 'medium', 'high')),
  location TEXT NOT NULL,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in-progress', 'resolved')),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create policies for complaints
DROP POLICY IF EXISTS "Users can view all complaints" ON public.complaints;
CREATE POLICY "Users can view all complaints" 
ON public.complaints 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create complaints" ON public.complaints;
CREATE POLICY "Users can create complaints" 
ON public.complaints 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own complaints" ON public.complaints;
CREATE POLICY "Users can update their own complaints" 
ON public.complaints 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can delete their own complaints" ON public.complaints;
CREATE POLICY "Users can delete their own complaints" 
ON public.complaints 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Insert some sample complaint data for demo purposes
INSERT INTO public.complaints (noise_type, description, intensity, location, contact, status, latitude, longitude) VALUES
('Construction', 'Loud drilling and hammering from construction site', 'high', 'Delhi, India', 'demo@test.com', 'submitted', 28.6139, 77.2090),
('Traffic', 'Heavy traffic noise during peak hours', 'medium', 'Mumbai, India', 'user@example.com', 'in-progress', 19.0760, 72.8777),
('Music', 'Loud music from neighbor party', 'medium', 'Bangalore, India', 'neighbor@example.com', 'resolved', 12.9716, 77.5946),
('Industrial', 'Factory machinery noise 24/7', 'high', 'Chennai, India', 'factory@example.com', 'submitted', 13.0827, 80.2707),
('Aircraft', 'Low flying planes causing noise pollution', 'low', 'Kolkata, India', 'airport@example.com', 'in-progress', 22.5726, 88.3639)
ON CONFLICT DO NOTHING;