import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Static fallback images
import heroWedding from "@/assets/hero-wedding.jpg";
import serviceWedding from "@/assets/service-wedding.jpg";
import servicePortrait from "@/assets/service-portrait.jpg";
import serviceCorporate from "@/assets/service-corporate.jpg";
import serviceEvent from "@/assets/service-event.jpg";
import serviceProduct from "@/assets/service-product.jpg";
import serviceDocumentary from "@/assets/service-documentary.jpg";
import galleryPortrait from "@/assets/gallery-portrait.jpg";
import galleryCorporate from "@/assets/gallery-corporate.jpg";
import galleryProduct from "@/assets/gallery-product.jpg";
import galleryDocumentary from "@/assets/gallery-documentary.jpg";
import galleryEvent from "@/assets/gallery-event.jpg";
import weddingGallery1 from "@/assets/wedding-gallery-1.jpg";
import weddingGallery2 from "@/assets/wedding-gallery-2.jpg";
import weddingGallery3 from "@/assets/wedding-gallery-3.jpg";
import weddingGallery4 from "@/assets/wedding-gallery-4.jpg";
import weddingGallery5 from "@/assets/wedding-gallery-5.jpg";
import weddingGallery6 from "@/assets/wedding-gallery-6.jpg";
import portraitGallery1 from "@/assets/portrait-gallery-1.jpg";
import portraitGallery2 from "@/assets/portrait-gallery-2.jpg";
import portraitGallery3 from "@/assets/portrait-gallery-3.jpg";
import eventGallery1 from "@/assets/event-gallery-1.jpg";
import eventGallery2 from "@/assets/event-gallery-2.jpg";
import productGallery1 from "@/assets/product-gallery-1.jpg";

const fallbackImages: Record<string, string> = {
  "hero-wedding": heroWedding,
  "service-wedding": serviceWedding,
  "service-portrait": servicePortrait,
  "service-corporate": serviceCorporate,
  "service-event": serviceEvent,
  "service-product": serviceProduct,
  "service-documentary": serviceDocumentary,
  "gallery-portrait": galleryPortrait,
  "gallery-corporate": galleryCorporate,
  "gallery-product": galleryProduct,
  "gallery-documentary": galleryDocumentary,
  "gallery-event": galleryEvent,
  "wedding-gallery-1": weddingGallery1,
  "wedding-gallery-2": weddingGallery2,
  "wedding-gallery-3": weddingGallery3,
  "wedding-gallery-4": weddingGallery4,
  "wedding-gallery-5": weddingGallery5,
  "wedding-gallery-6": weddingGallery6,
  "portrait-gallery-1": portraitGallery1,
  "portrait-gallery-2": portraitGallery2,
  "portrait-gallery-3": portraitGallery3,
  "event-gallery-1": eventGallery1,
  "event-gallery-2": eventGallery2,
  "product-gallery-1": productGallery1,
};

interface SiteImage {
  id: string;
  image_key: string;
  image_name: string;
  file_path: string | null;
  category: string;
  description: string | null;
}

// Global cache for site images
let imageCache: Record<string, string> = {};
let cacheLoaded = false;
let loadingPromise: Promise<void> | null = null;

const loadImageCache = async () => {
  if (cacheLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const { data } = await supabase
      .from("site_images")
      .select("image_key, file_path");

    if (data) {
      data.forEach((img) => {
        if (img.file_path) {
          const { data: urlData } = supabase.storage
            .from("photos")
            .getPublicUrl(img.file_path);
          // Add timestamp to prevent browser caching
          imageCache[img.image_key] = `${urlData.publicUrl}?t=${Date.now()}`;
        }
      });
    }
    cacheLoaded = true;
  })();

  return loadingPromise;
};

export const getSiteImage = (imageKey: string): string => {
  // Return cached URL if available
  if (imageCache[imageKey]) {
    return imageCache[imageKey];
  }
  // Return fallback
  return fallbackImages[imageKey] || "";
};

export const useSiteImage = (imageKey: string) => {
  const [imageUrl, setImageUrl] = useState<string>(
    imageCache[imageKey] || fallbackImages[imageKey] || ""
  );
  const [isLoading, setIsLoading] = useState(!cacheLoaded);

  useEffect(() => {
    const loadImage = async () => {
      await loadImageCache();
      setImageUrl(imageCache[imageKey] || fallbackImages[imageKey] || "");
      setIsLoading(false);
    };

    loadImage();
  }, [imageKey]);

  return { imageUrl, isLoading };
};

export const useSiteImages = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("site_images")
      .select("*")
      .order("category", { ascending: true })
      .order("image_name", { ascending: true });

    if (!error && data) {
      setImages(data as SiteImage[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
    // Add timestamp to prevent browser caching when image is updated
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  const updateImage = async (imageKey: string, filePath: string) => {
    const { error } = await supabase
      .from("site_images")
      .update({ file_path: filePath })
      .eq("image_key", imageKey);

    if (!error) {
      // Update cache with timestamp to bust browser cache
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);
      imageCache[imageKey] = `${urlData.publicUrl}?t=${Date.now()}`;
      await fetchImages();
    }

    return { error };
  };

  const clearImage = async (imageKey: string) => {
    const { error } = await supabase
      .from("site_images")
      .update({ file_path: null })
      .eq("image_key", imageKey);

    if (!error) {
      delete imageCache[imageKey];
      await fetchImages();
    }

    return { error };
  };

  return {
    images,
    isLoading,
    getPublicUrl,
    updateImage,
    clearImage,
    refetch: fetchImages,
    fallbackImages,
  };
};
