import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImages";

const GalleryImage = ({ imageKey, alt, category }: { imageKey: string; alt: string; category: string }) => {
  const { imageUrl } = useSiteImage(imageKey);
  return { src: imageUrl, alt, category };
};

const GallerySection = () => {
  const portrait = useSiteImage("gallery-portrait");
  const corporate = useSiteImage("gallery-corporate");
  const product = useSiteImage("gallery-product");
  const documentary = useSiteImage("gallery-documentary");
  const event = useSiteImage("gallery-event");

  const galleryImages = [
    { src: portrait.imageUrl, alt: "Portrait photography", category: "Portrait" },
    { src: corporate.imageUrl, alt: "Corporate photography", category: "Corporate" },
    { src: product.imageUrl, alt: "Product photography", category: "Product" },
    { src: documentary.imageUrl, alt: "Documentary photography", category: "Wedding" },
    { src: event.imageUrl, alt: "Event photography", category: "Event" },
  ];

  return (
    <section className="py-24 bg-charcoal">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Recent Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Featured <span className="italic text-primary">Gallery</span>
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large featured image */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg">
            <img
              src={galleryImages[3].src}
              alt={galleryImages[3].alt}
              className="w-full h-full object-cover min-h-[400px] md:min-h-full image-hover"
            />
            <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <span className="font-body text-sm uppercase tracking-widest text-primary">
                {galleryImages[3].category}
              </span>
            </div>
          </div>

          {/* Smaller images */}
          {galleryImages.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg aspect-[4/5]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover image-hover"
              />
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="font-body text-sm uppercase tracking-widest text-primary">
                  {image.category}
                </span>
              </div>
            </div>
          ))}

          {/* Event image */}
          <div className="relative group overflow-hidden rounded-lg aspect-[4/5]">
            <img
              src={galleryImages[4].src}
              alt={galleryImages[4].alt}
              className="w-full h-full object-cover image-hover"
            />
            <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <span className="font-body text-sm uppercase tracking-widest text-primary">
                {galleryImages[4].category}
              </span>
            </div>
          </div>
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
