import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string | null;
  category: string;
}

// Categories the admin panel offers, in the order they should appear as filters.
export const GALLERY_CATEGORIES = [
  "wedding",
  "portrait",
  "event",
  "corporate",
  "documentary",
  "product",
] as const;

export const categoryLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Reads the admin-managed homepage gallery. This is the unlimited, Sam-editable
 * source of portfolio images — unlike the fixed `site_images` slots, which only
 * cover the hero and the service cards.
 */
export const useHomepageGallery = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("homepage_gallery")
        .select("id, file_path, caption, category, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error || !data) {
        console.error("Failed to load homepage gallery:", error);
        setPhotos([]);
      } else {
        setPhotos(
          data.map((row) => ({
            id: row.id,
            url: supabase.storage.from("photos").getPublicUrl(row.file_path).data.publicUrl,
            caption: row.caption,
            category: (row.category || "").toLowerCase(),
          }))
        );
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { photos, isLoading };
};
