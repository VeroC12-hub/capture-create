-- Repair: restore the missing site_images rows.
--
-- The table was left holding a single row (event-gallery-1) after the Supabase
-- rebuild, so every other image_key was absent. The admin panel writes a new
-- picture with UPDATE ... WHERE image_key = $1, which matches zero rows when the
-- row is missing and reports no error, so uploads appeared to succeed while the
-- file path was silently discarded and the site kept serving bundled fallbacks.
--
-- ON CONFLICT DO NOTHING means this is safe to run more than once and will not
-- disturb any row that already has a file_path.

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
('product-gallery-1', 'Product Gallery 1', 'product-gallery', 'Product detail page gallery')
ON CONFLICT (image_key) DO NOTHING;

-- Point the hero at the picture that was already uploaded to storage on
-- 2026-07-29 but never recorded against a row.
UPDATE public.site_images
SET file_path = 'site-images/hero-wedding.JPG'
WHERE image_key = 'hero-wedding';

-- Check: every key the site asks for should now exist.
SELECT image_key, file_path IS NOT NULL AS has_image
FROM public.site_images
ORDER BY category, image_key;
