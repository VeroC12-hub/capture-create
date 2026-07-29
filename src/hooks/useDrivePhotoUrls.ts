import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves displayable URLs for photos held in the studio's Google Drive.
 *
 * Drive files are served by the edge function, which needs an Authorization
 * header — and an <img src> cannot send one. So each file is fetched with the
 * viewer's session and turned into an object URL. Photos already in Supabase
 * storage are public and need none of this.
 */
export const useDrivePhotoUrls = (
  galleryId: string | undefined,
  driveFileIds: string[]
) => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Stable key so the effect doesn't re-run on every render from a new array.
  const key = driveFileIds.join(",");

  useEffect(() => {
    if (!galleryId || driveFileIds.length === 0) return;

    let cancelled = false;
    const created: string[] = [];

    (async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      for (const fileId of driveFileIds) {
        if (cancelled) break;
        try {
          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive` +
              `?action=gallery-file&gallery_id=${encodeURIComponent(galleryId)}` +
              `&file_id=${encodeURIComponent(fileId)}`,
            { headers: { Authorization: `Bearer ${session.access_token}` } }
          );
          if (!res.ok) continue;
          const objectUrl = URL.createObjectURL(await res.blob());
          created.push(objectUrl);
          if (!cancelled) {
            setUrls((prev) => ({ ...prev, [fileId]: objectUrl }));
          }
        } catch (e) {
          console.error("Could not load Drive photo", fileId, e);
        }
      }

      if (!cancelled) setIsLoading(false);
    })();

    return () => {
      cancelled = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryId, key]);

  return { urls, isLoading };
};
