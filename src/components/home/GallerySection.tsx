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
  const wedding1 = useSiteImage("wedding-gallery-1");
  const wedding2 = useSiteImage("wedding-gallery-2");
  const portrait1 = useSiteImage("portrait-gallery-1");
  const event1 = useSiteImage("event-gallery-1");

  const galleryImages = [
    { src: portrait.imageUrl, alt: "Portrait photography", category: "Portrait" },
    { src: corporate.imageUrl, alt: "Corporate photography", category: "Corporate" },
    { src: product.imageUrl, alt: "Product photography", category: "Product" },
    { src: documentary.imageUrl, alt: "Documentary photography", category: "Wedding" },
    { src: event.imageUrl, alt: "Event photography", category: "Event" },
    { src: wedding1.imageUrl, alt: "Wedding photography", category: "Wedding" },
    { src: wedding2.imageUrl, alt: "Wedding ceremony", category: "Wedding" },
    { src: portrait1.imageUrl, alt: "Professional portrait", category: "Portrait" },
    { src: event1.imageUrl, alt: "Special event", category: "Event" },
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

        {/* Gallery Grid - Expanded with more images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-lg ${
                index === 0 ? "col-span-2 row-span-2" : "aspect-[4/5]"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover image-hover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="font-body text-sm uppercase tracking-widest text-primary">
                  {image.category}
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
