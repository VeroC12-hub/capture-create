-- Add user_id column to bookings table
ALTER TABLE public.bookings
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);

-- Add RLS policy for clients to view their own bookings
CREATE POLICY "Clients can view own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

-- Add RLS policy for authenticated users to create bookings
CREATE POLICY "Authenticated users can create own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);