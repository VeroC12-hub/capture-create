-- Link client galleries to Google Drive.
--
-- Delivery flow: the admin creates a folder per client per programme, uploads the
-- full-resolution photographs into it, and the client downloads them from the
-- client portal. Drive holds the originals because Supabase storage is 1GB on the
-- free tier, which a single wedding would exhaust.

ALTER TABLE public.client_galleries
  ADD COLUMN IF NOT EXISTS drive_folder_id TEXT,
  ADD COLUMN IF NOT EXISTS drive_folder_url TEXT,
  -- The programme/event this gallery covers, e.g. "Traditional Marriage" or
  -- "Reception". Sits under the client's folder in Drive.
  ADD COLUMN IF NOT EXISTS programme TEXT,
  -- Set when the gallery has actually been handed to the client, so the admin can
  -- tell prepared galleries apart from delivered ones.
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS client_galleries_drive_folder_idx
  ON public.client_galleries (drive_folder_id);

-- Photos may now live in Drive rather than Supabase storage. file_path stays
-- nullable-compatible for existing rows; Drive-backed rows carry the ids instead.
ALTER TABLE public.gallery_photos
  ADD COLUMN IF NOT EXISTS drive_file_id TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS size_bytes BIGINT;

CREATE INDEX IF NOT EXISTS gallery_photos_drive_file_idx
  ON public.gallery_photos (drive_file_id);

-- Existing rows are Supabase-storage backed and require file_path; Drive-backed
-- rows supply drive_file_id instead. Enforce that one of the two is always present.
ALTER TABLE public.gallery_photos
  ALTER COLUMN file_path DROP NOT NULL;

ALTER TABLE public.gallery_photos
  DROP CONSTRAINT IF EXISTS gallery_photos_has_source;

ALTER TABLE public.gallery_photos
  ADD CONSTRAINT gallery_photos_has_source
  CHECK (file_path IS NOT NULL OR drive_file_id IS NOT NULL);
