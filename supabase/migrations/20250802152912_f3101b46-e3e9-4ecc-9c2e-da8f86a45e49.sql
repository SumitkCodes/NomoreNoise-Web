-- Enable realtime for complaints table
ALTER TABLE public.complaints REPLICA IDENTITY FULL;

-- Add complaints table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;