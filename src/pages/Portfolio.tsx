import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSiteImage } from "@/hooks/useSiteImages";

const categories = ["All", "Wedding", "Portrait", "Corporate", "Event", "Product"];

const portfolioItemsData = [
  { imageKey: "hero-wedding", category: "Wedding", title: "Sarah & Michael" },
  { imageKey: "gallery-portrait", category: "Portrait", title: "Elena Portrait" },
  { imageKey: "gallery-corporate", category: "Corporate", title: "Tech Startup Team" },
  { imageKey: "gallery-documentary", category: "Wedding", title: "Garden Ceremony" },
  { imageKey: "gallery-event", category: "Event", title: "Anniversary Gala" },
  { imageKey: "gallery-product", category: "Product", title: "Luxury Perfume" },
  { imageKey: "portrait-gallery-1", category: "Portrait", title: "Executive Headshot" },
  { imageKey: "wedding-gallery-1", category: "Wedding", title: "Beach Wedding" },
  { imageKey: "service-corporate", category: "Corporate", title: "Board Meeting" },
  { imageKey: "wedding-gallery-2", category: "Wedding", title: "Romantic Couple" },
  { imageKey: "wedding-gallery-3", category: "Wedding", title: "Exchange of Vows" },
  { imageKey: "wedding-gallery-4", category: "Wedding", title: "First Dance" },
  { imageKey: "portrait-gallery-2", category: "Portrait", title: "Creative Portrait" },
  { imageKey: "portrait-gallery-3", category: "Portrait", title: "Studio Portrait" },
  { imageKey: "event-gallery-1", category: "Event", title: "Birthday Celebration" },
  { imageKey: "event-gallery-2", category: "Event", title: "Corporate Gala" },
  { imageKey: "service-event", category: "Event", title: "Special Moments" },
  { imageKey: "service-portrait", category: "Portrait", title: "Professional Session" },
];

const PortfolioItem = ({ imageKey, category, title }: { imageKey: string; category: string; title: string }) => {
  const { imageUrl } = useSiteImage(imageKey);
  
  return (
    <div className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <p className="font-body text-xs uppercase tracking-widest text-primary mb-1">
          {category}
        </p>
        <h3 className="font-display text-xl text-foreground">
          {title}
        </h3>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = activeCategory === "All" 
    ? portfolioItemsData 
    : portfolioItemsData.filter(item => item.category === activeCategory);

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
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-body text-sm uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground border border-border hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <PortfolioItem key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Portfolio;
