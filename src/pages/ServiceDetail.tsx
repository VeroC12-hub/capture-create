import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Calendar, X } from "lucide-react";

import serviceWedding from "@/assets/service-wedding.jpg";
import servicePortrait from "@/assets/service-portrait.jpg";
import serviceCorporate from "@/assets/service-corporate.jpg";
import serviceEvent from "@/assets/service-event.jpg";
import serviceProduct from "@/assets/service-product.jpg";
import serviceDocumentary from "@/assets/service-documentary.jpg";

// Wedding gallery
import weddingGallery1 from "@/assets/wedding-gallery-1.jpg";
import weddingGallery2 from "@/assets/wedding-gallery-2.jpg";
import weddingGallery3 from "@/assets/wedding-gallery-3.jpg";
import weddingGallery4 from "@/assets/wedding-gallery-4.jpg";
import weddingGallery5 from "@/assets/wedding-gallery-5.jpg";
import weddingGallery6 from "@/assets/wedding-gallery-6.jpg";

// Portrait gallery
import portraitGallery1 from "@/assets/portrait-gallery-1.jpg";
import portraitGallery2 from "@/assets/portrait-gallery-2.jpg";
import portraitGallery3 from "@/assets/portrait-gallery-3.jpg";

// Event gallery
import eventGallery1 from "@/assets/event-gallery-1.jpg";
import eventGallery2 from "@/assets/event-gallery-2.jpg";

// Product gallery
import productGallery1 from "@/assets/product-gallery-1.jpg";

const servicesData = {
  wedding: {
    title: "Wedding Photography",
    tagline: "For the wildly in love",
    description: "Your love story deserves to be told beautifully. We capture every emotion, every tear of joy, and every precious moment of your special day with artistry and heart.",
    image: serviceWedding,
    gallery: [
      { src: weddingGallery1, caption: "The Ceremony" },
      { src: weddingGallery2, caption: "Getting Ready" },
      { src: weddingGallery3, caption: "First Dance" },
      { src: weddingGallery4, caption: "The Details" },
      { src: weddingGallery5, caption: "Bridal Party" },
      { src: weddingGallery6, caption: "Golden Hour" },
      { src: serviceWedding, caption: "Bride Portrait" },
    ],
    features: [
      "Full-day coverage (8-12 hours)",
      "Second photographer included",
      "Pre-wedding consultation",
      "Engagement session",
      "High-resolution edited images (500+)",
      "Online gallery for easy sharing",
      "Premium wedding album",
      "Same-day sneak peeks"
    ],
    packages: [
      { name: "Essential", price: "$2,500", description: "6 hours coverage, 1 photographer, 300+ images" },
      { name: "Classic", price: "$4,000", description: "10 hours coverage, 2 photographers, 500+ images, album" },
      { name: "Luxury", price: "$6,500", description: "Full day, 2 photographers, engagement session, premium album" }
    ]
  },
  portrait: {
    title: "Portrait Sessions",
    tagline: "Reveal your authentic self",
    description: "Professional portraits that capture your unique personality and style. Perfect for individuals, couples, families, and professional headshots.",
    image: servicePortrait,
    gallery: [
      { src: servicePortrait, caption: "Studio Portrait" },
      { src: portraitGallery1, caption: "Executive Headshot" },
      { src: portraitGallery2, caption: "Family Session" },
      { src: portraitGallery3, caption: "Couples Portrait" },
    ],
    features: [
      "1-2 hour session",
      "Multiple outfit changes",
      "Indoor or outdoor location",
      "Professional retouching",
      "25+ edited images",
      "Print-ready files",
      "Styling consultation",
      "Private online gallery"
    ],
    packages: [
      { name: "Mini Session", price: "$300", description: "30 minutes, 1 location, 15 images" },
      { name: "Standard", price: "$500", description: "1 hour, 2 outfits, 25+ images" },
      { name: "Premium", price: "$800", description: "2 hours, unlimited outfits, 50+ images" }
    ]
  },
  corporate: {
    title: "Corporate Photography",
    tagline: "Elevate your brand image",
    description: "Polished corporate imagery that elevates your brand. From headshots to team photos and office environment shots, we deliver professional results.",
    image: serviceCorporate,
    gallery: [
      { src: serviceCorporate, caption: "Team Photo" },
      { src: portraitGallery1, caption: "Executive Headshot" },
      { src: eventGallery1, caption: "Conference Coverage" },
    ],
    features: [
      "Professional headshots",
      "Team & group photos",
      "Office environment shots",
      "Quick turnaround (48 hours)",
      "Consistent brand style",
      "Commercial usage rights",
      "On-site or studio options",
      "LinkedIn optimized files"
    ],
    packages: [
      { name: "Individual", price: "$200", description: "1 person, 3 final images, 30 min session" },
      { name: "Team", price: "$500", description: "Up to 5 people, group + individual shots" },
      { name: "Corporate", price: "$1,500", description: "Full team, environment shots, half-day" }
    ]
  },
  events: {
    title: "Event Coverage",
    tagline: "Every moment matters",
    description: "Every celebration tells a story. We document your events with candid, energetic photography that captures the atmosphere and emotions.",
    image: serviceEvent,
    gallery: [
      { src: serviceEvent, caption: "Celebration" },
      { src: eventGallery1, caption: "Conference" },
      { src: eventGallery2, caption: "Birthday Party" },
      { src: weddingGallery3, caption: "Reception" },
    ],
    features: [
      "Full event coverage",
      "Candid & posed shots",
      "Fast delivery (72 hours)",
      "Online gallery sharing",
      "Social media ready images",
      "Highlight collection",
      "Multiple photographers available",
      "Video add-on available"
    ],
    packages: [
      { name: "Basic", price: "$800", description: "3 hours coverage, 150+ images" },
      { name: "Standard", price: "$1,500", description: "6 hours coverage, 300+ images" },
      { name: "Full Event", price: "$2,500", description: "Full day coverage, 500+ images, 2 photographers" }
    ]
  },
  product: {
    title: "Product Photography",
    tagline: "Images that sell",
    description: "High-end product imagery that sells. Perfect for e-commerce, catalogs, and marketing materials. We make your products shine.",
    image: serviceProduct,
    gallery: [
      { src: serviceProduct, caption: "Beauty Products" },
      { src: productGallery1, caption: "Luxury Watch" },
    ],
    features: [
      "Studio or on-location",
      "Clean white backgrounds",
      "Lifestyle product shots",
      "Color accurate editing",
      "Web optimized files",
      "Commercial usage rights",
      "360° product views",
      "Consistent catalog style"
    ],
    packages: [
      { name: "Starter", price: "$200", description: "5 products, white background" },
      { name: "E-commerce", price: "$500", description: "15 products, multiple angles" },
      { name: "Brand Package", price: "$1,200", description: "30+ products, lifestyle shots included" }
    ]
  },
  documentary: {
    title: "Documentary Photography",
    tagline: "Stories worth telling",
    description: "Authentic storytelling through candid, journalistic imagery. Perfect for personal projects, publications, and capturing real life moments.",
    image: serviceDocumentary,
    gallery: [
      { src: serviceDocumentary, caption: "Street Life" },
      { src: eventGallery2, caption: "Candid Moments" },
    ],
    features: [
      "Storytelling approach",
      "Natural, unposed moments",
      "Extended coverage options",
      "Black & white options",
      "Custom packages available",
      "Publication ready files",
      "Editorial style editing",
      "Project collaboration"
    ],
    packages: [
      { name: "Day Rate", price: "$1,000", description: "Full day documentary coverage" },
      { name: "Project", price: "Custom", description: "Multi-day projects, custom scope" },
      { name: "Publication", price: "Custom", description: "Editorial & commercial rights included" }
    ]
  }
};

const ServiceDetail = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  if (!serviceType || !servicesData[serviceType as keyof typeof servicesData]) {
    return <Navigate to="/services" replace />;
  }

  const service = servicesData[serviceType as keyof typeof servicesData];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero with Full Image */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 pb-16 relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center text-foreground/80 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Services
          </Link>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            {service.tagline}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
              Our Work
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              Featured <span className="italic text-primary">Gallery</span>
            </h2>
          </div>
          
          {/* Masonry-style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {service.gallery.map((item, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-lg cursor-pointer ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                } ${index === 3 ? "col-span-2" : ""}`}
                onClick={() => setSelectedImage(item.src)}
              >
                <div className={`relative ${index === 0 ? "aspect-square" : "aspect-[4/5]"}`}>
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-foreground font-display text-lg">{item.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-12">
            What's <span className="italic text-primary">Included</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
              Investment
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              Pricing <span className="italic text-primary">Packages</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {service.packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-card border rounded-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-card ${
                  index === 1 ? "border-primary" : "border-border"
                }`}
              >
                {index === 1 && (
                  <span className="inline-block bg-primary text-primary-foreground text-xs uppercase tracking-widest px-4 py-1 rounded-full mb-4">
                    Popular
                  </span>
                )}
                <h3 className="font-display text-2xl text-foreground mb-2">
                  {pkg.name}
                </h3>
                <p className="font-display text-4xl text-primary mb-4">
                  {pkg.price}
                </p>
                <p className="text-muted-foreground text-sm mb-8">
                  {pkg.description}
                </p>
                <Link to="/booking">
                  <Button
                    variant={index === 1 ? "hero" : "elegant"}
                    className="w-full"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Ready to <span className="italic text-primary">Get Started?</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Let's discuss your {service.title.toLowerCase()} needs and create something beautiful together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button variant="hero" size="xl">
                <Calendar className="mr-2" />
                Book a Session
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="elegant" size="xl">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </main>
  );
};

export default ServiceDetail;