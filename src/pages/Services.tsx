import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, X, Heart, PartyPopper, Building2, Camera, Video } from "lucide-react";
import { photographyPackages, videographyPackages } from "@/data/pricingData";
import { useSiteImage } from "@/hooks/useSiteImages";

// Full-screen image lightbox
const ImageLightbox = ({ imageKey, onClose }: { imageKey: string | null; onClose: () => void }) => {
  const { imageUrl } = useSiteImage(imageKey || "");

  if (!imageKey) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/98 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <img
        src={imageUrl}
        alt="Gallery"
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// Large Gallery Grid Component
const GalleryGrid = ({ imageKeys, columns = 3 }: { imageKeys: string[]; columns?: number }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const gridClass = columns === 4
    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    : columns === 3
    ? "grid-cols-2 md:grid-cols-3"
    : "grid-cols-1 md:grid-cols-2";

  return (
    <>
      <div className={`grid ${gridClass} gap-4`}>
        {imageKeys.map((imageKey, idx) => (
          <GalleryImage
            key={idx}
            imageKey={imageKey}
            onClick={() => setSelectedImage(imageKey)}
            isLarge={idx === 0 && columns === 3}
          />
        ))}
      </div>
      <ImageLightbox imageKey={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
};

// Gallery Image with hover effect
const GalleryImage = ({
  imageKey,
  onClick,
  isLarge = false
}: {
  imageKey: string;
  onClick: () => void;
  isLarge?: boolean;
}) => {
  const { imageUrl } = useSiteImage(imageKey);

  return (
    <div
      className={`group relative overflow-hidden rounded-lg cursor-pointer ${
        isLarge ? "md:col-span-2 md:row-span-2" : ""
      }`}
      onClick={onClick}
    >
      <div className={`relative ${isLarge ? "aspect-square" : "aspect-[4/3]"}`}>
        <img
          src={imageUrl}
          alt="Gallery"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all duration-300 flex items-center justify-center">
          <Camera className="w-12 h-12 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100" />
        </div>
      </div>
    </div>
  );
};

// Massive Hero with Multiple Images
const HeroSection = ({
  title,
  subtitle,
  imageKeys
}: {
  title: string;
  subtitle: string;
  imageKeys: string[];
}) => {
  return (
    <section className="relative min-h-screen py-32">
      {/* Background Gallery - Large Images */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
        {imageKeys.slice(0, 6).map((imageKey, idx) => {
          const { imageUrl } = useSiteImage(imageKey);
          return (
            <div key={idx} className="relative overflow-hidden">
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  animation: `fadeIn 1s ease-out ${idx * 0.2}s both`
                }}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 flex items-center min-h-screen">
        <div className="max-w-4xl">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            {subtitle}
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-8xl font-light text-foreground mb-8">
            {title}
          </h1>
          <Link to="/booking">
            <Button variant="hero" size="xl" className="text-lg">
              <Calendar className="mr-2 w-5 h-5" />
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Compact Package Card
const PackageCard = ({ pkg, type }: { pkg: any; type: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className="mb-2">{type}</Badge>
            <h3 className="font-display text-xl mb-1">{pkg.name}</h3>
            <p className="font-display text-3xl text-primary">{pkg.price}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {pkg.coverage.join(" • ")}
        </p>

        {isExpanded && (
          <div className="mb-4 animate-fade-in">
            <ul className="space-y-2">
              {pkg.includes.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1"
          >
            {isExpanded ? "Hide" : "View"} Details
          </Button>
          <Link to="/booking" className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ========== WEDDINGS SECTION ========== */}
      <section id="weddings">
        <HeroSection
          title="Weddings"
          subtitle="For the wildly in love"
        imageKeys={[
          "service-wedding",
          "wedding-gallery-1",
          "wedding-gallery-2",
          "wedding-gallery-3",
          "wedding-gallery-4",
          "wedding-gallery-5"
        ]}
      />

      {/* Wedding Gallery Showcase */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl md:text-5xl">
                Wedding <span className="italic text-primary">Memories</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every love story is unique. Here's a glimpse of the beautiful moments we've captured.
            </p>
          </div>

          {/* Large Gallery */}
          <GalleryGrid
            imageKeys={[
              "service-wedding",
              "wedding-gallery-1",
              "wedding-gallery-2",
              "wedding-gallery-3",
              "wedding-gallery-4",
              "wedding-gallery-5",
              "wedding-gallery-6",
              "service-wedding",
              "wedding-gallery-1"
            ]}
            columns={3}
          />
        </div>
      </section>

      {/* Wedding Packages - Compact */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl md:text-4xl mb-4">
              Wedding <span className="italic text-primary">Packages</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect package for your special day
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Photography */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-primary" />
                <h4 className="font-display text-2xl">Photography</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {photographyPackages.map((pkg, idx) => (
                  <PackageCard key={idx} pkg={pkg} type="Photo" />
                ))}
              </div>
            </div>

            {/* Videography */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-6 h-6 text-primary" />
                <h4 className="font-display text-2xl">Videography</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {videographyPackages.map((pkg, idx) => (
                  <PackageCard key={idx} pkg={pkg} type="Video" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </section>

      {/* ========== EVENTS SECTION ========== */}
      <section id="events">
        <HeroSection
          title="Events"
          subtitle="Every moment matters"
        imageKeys={[
          "service-event",
          "event-gallery-1",
          "event-gallery-2",
          "wedding-gallery-3",
          "service-portrait",
          "portrait-gallery-1"
        ]}
      />

      {/* Events Gallery */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PartyPopper className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl md:text-5xl">
                Celebration <span className="italic text-primary">Moments</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Birthdays, naming ceremonies, anniversaries - we capture the joy in every celebration.
            </p>
          </div>

          <GalleryGrid
            imageKeys={[
              "service-event",
              "event-gallery-1",
              "event-gallery-2",
              "service-portrait",
              "portrait-gallery-1",
              "portrait-gallery-2",
              "portrait-gallery-3",
              "wedding-gallery-3"
            ]}
            columns={4}
          />

          {/* Event Pricing */}
          <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Birthdays & Anniversaries", price: "GH₵ 2,500" },
              { name: "Naming Ceremonies", price: "GH₵ 2,000" },
              { name: "Festive Events", price: "GH₵ 3,500" }
            ].map((event, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <h3 className="font-display text-xl mb-2">{event.name}</h3>
                <p className="font-display text-3xl text-primary mb-4">{event.price}</p>
                <Link to="/booking">
                  <Button variant="elegant" className="w-full">
                    Book Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      </section>

      {/* ========== PROFESSIONAL SECTION ========== */}
      <section id="professional">
        <HeroSection
          title="Professional"
          subtitle="Elevate your brand"
        imageKeys={[
          "service-corporate",
          "service-product",
          "portrait-gallery-1",
          "service-documentary",
          "event-gallery-1",
          "service-portrait"
        ]}
      />

      {/* Professional Gallery */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-primary" />
              <h2 className="font-display text-4xl md:text-5xl">
                Business <span className="italic text-primary">Portfolio</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Corporate events, headshots, product photography - professional imagery that makes an impact.
            </p>
          </div>

          <GalleryGrid
            imageKeys={[
              "service-corporate",
              "service-product",
              "portrait-gallery-1",
              "service-documentary",
              "event-gallery-1",
              "service-portrait",
              "portrait-gallery-2",
              "portrait-gallery-3"
            ]}
            columns={4}
          />

          {/* Professional Pricing */}
          <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Corporate Events", price: "GH₵ 2,200" },
              { name: "Headshots & Portraits", price: "From GH₵ 500" },
              { name: "Product Photography", price: "From GH₵ 200" }
            ].map((service, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <h3 className="font-display text-xl mb-2">{service.name}</h3>
                <p className="font-display text-3xl text-primary mb-4">{service.price}</p>
                <Link to="/booking">
                  <Button variant="elegant" className="w-full">
                    Book Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      </section>

      {/* Final CTA with Background Gallery */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 gap-2 p-2 opacity-20">
          {[
            "service-wedding",
            "service-event",
            "service-corporate",
            "service-portrait",
            "wedding-gallery-1",
            "event-gallery-1",
            "portrait-gallery-1",
            "service-product"
          ].map((key, idx) => {
            const { imageUrl } = useSiteImage(key);
            return (
              <div key={idx} className="aspect-square">
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8">
            Ready to <span className="italic text-primary">Create Magic?</span>
          </h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Let's capture your story. Every moment, every emotion, every beautiful detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/booking">
              <Button variant="hero" size="xl" className="text-lg px-12">
                <Calendar className="mr-2" />
                Book Your Session
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="elegant" size="xl" className="text-lg px-12">
                View More Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
