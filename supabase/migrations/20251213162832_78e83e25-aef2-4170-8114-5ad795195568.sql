-- Create table for site-wide replaceable images
CREATE TABLE public.site_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_key text NOT NULL UNIQUE,
  image_name text NOT NULL,
  file_path text,
  category text NOT NULL DEFAULT 'general',
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view site images (they're public)
CREATE POLICY "Anyone can view site images"
ON public.site_images
FOR SELECT
USING (true);

-- Only admins can manage site images
CREATE POLICY "Admins can manage site images"
ON public.site_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_site_images_updated_at
BEFORE UPDATE ON public.site_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert default image entries
INSERT INTO public.site_images (image_key, image_name, category, description) VALUES
-- Hero
('hero-wedding', 'Hero Image', 'hero', 'Main hero section background'),
-- Services
('service-wedding', 'Wedding Service', 'services', 'Wedding photography service image'),
('service-portrait', 'Portrait Service', 'services', 'Portrait photography service image'),
('service-corporate', 'Corporate Service', 'services', 'Corporate photography service image'),
('service-event', 'Event Service', 'services', 'Event photography service image'),
('service-product', 'Product Service', 'services', 'Product photography service image'),
('service-documentary', 'Documentary Service', 'services', 'Documentary photography service image'),
-- Gallery
('gallery-portrait', 'Gallery Portrait', 'gallery', 'Featured gallery portrait image'),
('gallery-corporate', 'Gallery Corporate', 'gallery', 'Featured gallery corporate image'),
('gallery-product', 'Gallery Product', 'gallery', 'Featured gallery product image'),
('gallery-documentary', 'Gallery Documentary', 'gallery', 'Featured gallery documentary image'),
('gallery-event', 'Gallery Event', 'gallery', 'Featured gallery event image'),
-- Wedding Gallery
('wedding-gallery-1', 'Wedding Gallery 1', 'wedding-gallery', 'Wedding detail page gallery'),
('wedding-gallery-2', 'Wedding Gallery 2', 'wedding-gallery', 'Wedding detail page gallery'),
('wedding-gallery-3', 'Wedding Gallery 3', 'wedding-gallery', 'Wedding detail page gallery'),
('wedding-gallery-4', 'Wedding Gallery 4', 'wedding-gallery', 'Wedding detail page gallery'),
('wedding-gallery-5', 'Wedding Gallery 5', 'wedding-gallery', 'Wedding detail page gallery'),
('wedding-gallery-6', 'Wedding Gallery 6', 'wedding-gallery', 'Wedding detail page gallery'),
-- Portrait Gallery
('portrait-gallery-1', 'Portrait Gallery 1', 'portrait-gallery', 'Portrait detail page gallery'),
('portrait-gallery-2', 'Portrait Gallery 2', 'portrait-gallery', 'Portrait detail page gallery'),
('portrait-gallery-3', 'Portrait Gallery 3', 'portrait-gallery', 'Portrait detail page gallery'),
-- Event Gallery
('event-gallery-1', 'Event Gallery 1', 'event-gallery', 'Event detail page gallery'),
('event-gallery-2', 'Event Gallery 2', 'event-gallery', 'Event detail page gallery'),
-- Product Gallery
('product-gallery-1', 'Product Gallery 1', 'product-gallery', 'Product detail page gallery');