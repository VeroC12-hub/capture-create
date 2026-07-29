-- Add user_id column to bookings table
--
-- NOTE: this migration duplicates 20251214000000_add_user_id_to_bookings.sql,
-- which Lovable generated a day earlier with identical statements. Replaying the
-- history against a fresh database therefore failed here on a duplicate column.
-- The statements below are guarded so this migration is a no-op wherever the
-- earlier one already ran, while still being correct on its own.

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);

-- Add RLS policy for clients to view their own bookings
DROP POLICY IF EXISTS "Clients can view own bookings" ON public.bookings;
CREATE POLICY "Clients can view own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

-- Add RLS policy for authenticated users to create bookings
DROP POLICY IF EXISTS "Authenticated users can create own bookings" ON public.bookings;
CREATE POLICY "Authenticated users can create own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
