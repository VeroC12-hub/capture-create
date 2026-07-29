-- Galleries are works in progress until the photographer says otherwise.
--
-- Previously a gallery became visible to its client the moment a client was
-- assigned, so a half-edited set could be seen mid-upload. Clients now only see
-- galleries that have been explicitly delivered.

DROP POLICY IF EXISTS "Clients can view own galleries" ON public.client_galleries;

CREATE POLICY "Clients can view delivered galleries"
  ON public.client_galleries FOR SELECT
  USING (
    (auth.uid() = client_id AND delivered_at IS NOT NULL)
    OR is_public = true
    OR public.has_role(auth.uid(), 'admin')
  );

-- Photos follow their gallery: only visible once that gallery is delivered.
DROP POLICY IF EXISTS "Users can view photos in accessible galleries" ON public.gallery_photos;

CREATE POLICY "Users can view photos in delivered galleries"
  ON public.gallery_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_galleries g
      WHERE g.id = gallery_photos.gallery_id
        AND (
          (auth.uid() = g.client_id AND g.delivered_at IS NOT NULL)
          OR g.is_public = true
          OR public.has_role(auth.uid(), 'admin')
        )
    )
  );

COMMENT ON COLUMN public.client_galleries.delivered_at IS
  'Set when the gallery is handed to the client. Null means still being worked on and hidden from them.';
