import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  useHomepageGallery,
  GALLERY_CATEGORIES,
  categoryLabel,
  type GalleryPhoto,
} from "@/hooks/useHomepageGallery";

const PortfolioItem = ({ photo }: { photo: GalleryPhoto }) => (
  <div className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
    <img
      src={photo.url}
      alt={photo.caption || `${categoryLabel(photo.category)} photography by SamBlessing`}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    {/* Dark scrim on hover so the label reads over any photograph. */}
    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
      <p className="font-body text-xs uppercase tracking-widest text-gold-light">
        {categoryLabel(photo.category)}
      </p>
      {photo.caption && (
        <h3 className="font-display text-xl text-cream mt-1">{photo.caption}</h3>
      )}
    </div>
  </div>
);

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { photos, isLoading } = useHomepageGallery();

  // Only offer filters that actually have photographs behind them, so a client
  // never clicks a category and lands on an empty grid.
  const available = GALLERY_CATEGORIES.filter((c) =>
    photos.some((p) => p.category === c)
  );

  const filteredItems =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Our Work
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
            Portfolio <span className="italic text-primary">Gallery</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of our finest work across weddings, portraits, corporate events, and more.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-40 backdrop-blur-md bg-background/95">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {["all", ...available].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-body text-sm uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground border border-border hover:border-primary"
                }`}
              >
                {category === "all" ? "All" : categoryLabel(category)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No photographs in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((photo) => (
                <PortfolioItem key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Portfolio;
