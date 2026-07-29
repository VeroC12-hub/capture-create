import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useHomepageGallery, categoryLabel } from "@/hooks/useHomepageGallery";

// How many photographs the homepage teaser shows before sending people to the
// full portfolio. The gallery itself is unlimited and managed from the admin.
const FEATURED_COUNT = 12;

const GallerySection = () => {
  const { photos, isLoading } = useHomepageGallery();
  const featured = photos.slice(0, FEATURED_COUNT);

  if (!isLoading && featured.length === 0) return null;

  return (
    <section className="py-24 bg-charcoal">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* This band sits on bg-charcoal, so it needs light type — the default
              foreground/primary are dark and all but vanish against it. */}
          <p className="font-body text-sm tracking-[0.3em] uppercase text-gold-light mb-4">
            Recent Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-cream">
            Featured <span className="italic text-gold-light">Gallery</span>
          </h2>
        </div>

        {/* Gallery grid, driven by the admin-managed gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: FEATURED_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-lg bg-muted/20 animate-pulse ${
                    i === 0 ? "col-span-2 row-span-2" : "aspect-[4/5]"
                  }`}
                />
              ))
            : featured.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative group overflow-hidden rounded-lg ${
                    index === 0 ? "col-span-2 row-span-2" : "aspect-[4/5]"
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `${categoryLabel(photo.category)} photography by SamBlessing`}
                    loading="lazy"
                    className="w-full h-full object-cover image-hover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Scrim so the category label stays readable on light photos. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="font-body text-sm uppercase tracking-widest text-gold-light">
                      {categoryLabel(photo.category)}
                    </span>
                  </div>
                </div>
              ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/portfolio">
            <Button variant="gold" size="lg">
              View Full Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
