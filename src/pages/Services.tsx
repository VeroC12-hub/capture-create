import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Star, Heart, PartyPopper, Building2, ArrowRight, Sparkles } from "lucide-react";
import { photographyPackages, videographyPackages, extras } from "@/data/pricingData";
import { useSiteImage } from "@/hooks/useSiteImages";

const ServiceHero = ({
  title,
  subtitle,
  description,
  imageKeys,
  icon: Icon
}: {
  title: string;
  subtitle: string;
  description: string;
  imageKeys: string[];
  icon: any;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { imageUrl } = useSiteImage(imageKeys[currentImageIndex]);

  return (
    <section className="relative h-[60vh] min-h-[500px] overflow-hidden group">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 h-full flex items-end pb-16 relative z-10">
        <div className="max-w-3xl">
          <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center mb-6 animate-fade-in">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3 animate-fade-in">
            {subtitle}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 animate-fade-up">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl animate-fade-up">
            {description}
          </p>

          {/* Image Navigation Dots */}
          {imageKeys.length > 1 && (
            <div className="flex gap-2 animate-fade-in">
              {imageKeys.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const PackageCard = ({ pkg, isPopular, category }: { pkg: any; isPopular?: boolean; category: string }) => {
  return (
    <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
      isPopular ? "border-primary border-2" : "border-border"
    }`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg z-10 flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-xs font-semibold">POPULAR</span>
        </div>
      )}

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="text-center pb-4 relative">
        <div className="mb-3">
          <Badge variant="outline" className="mb-2">{category}</Badge>
        </div>
        <CardTitle className="font-display text-2xl mb-2">{pkg.name}</CardTitle>
        <div className="font-display text-4xl text-primary mb-2">{pkg.price}</div>
        <CardDescription className="text-sm leading-relaxed">
          {pkg.coverage.join(" • ")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            What's Included:
          </h4>
          <ul className="space-y-2">
            {pkg.includes.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {pkg.highlights.map((highlight: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="relative">
        <Link to="/booking" className="w-full">
          <Button
            variant={isPopular ? "hero" : "elegant"}
            className="w-full group"
            size="lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book This Package
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const EventServiceCard = ({ service }: { service: any }) => {
  const { imageUrl } = useSiteImage(service.imageKey);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary transition-all duration-500 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-display text-lg">
          {service.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl text-foreground mb-2">{service.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{service.description}</p>

        <ul className="space-y-2 mb-6">
          {service.includes.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Link to="/booking">
          <Button variant="elegant" className="w-full group">
            Book Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const Services = () => {
  const eventServices = [
    {
      name: "Birthday & Anniversary",
      price: "GH₵ 2,500",
      description: "Celebrate life's special moments with vibrant, joyful photography",
      imageKey: "service-event",
      includes: [
        "Full event coverage",
        "150+ edited photos",
        "Online gallery",
        "Event highlights reel"
      ]
    },
    {
      name: "Naming Ceremony",
      price: "GH₵ 2,000",
      description: "Preserve the precious moments of welcoming your little one",
      imageKey: "service-portrait",
      includes: [
        "Ceremony coverage",
        "100+ edited photos",
        "Family portraits",
        "Digital delivery"
      ]
    },
    {
      name: "Festive Events",
      price: "GH₵ 3,500",
      description: "Capture the energy and excitement of your celebrations",
      imageKey: "service-event",
      includes: [
        "Extended coverage",
        "200+ edited photos",
        "Multiple locations",
        "Fast turnaround"
      ]
    }
  ];

  const professionalServices = [
    {
      name: "Corporate Events",
      price: "GH₵ 2,200",
      description: "Professional event documentation for your business",
      imageKey: "service-corporate",
      includes: [
        "Event photography",
        "Team photos",
        "Venue shots",
        "Same-day previews"
      ]
    },
    {
      name: "Headshots & Portraits",
      price: "From GH₵ 500",
      description: "Professional portraits for individuals and teams",
      imageKey: "service-portrait",
      includes: [
        "Studio or location",
        "Professional retouching",
        "Multiple outfit options",
        "LinkedIn-ready files"
      ]
    },
    {
      name: "Product Photography",
      price: "From GH₵ 200",
      description: "Make your products shine with professional imagery",
      imageKey: "service-product",
      includes: [
        "Studio lighting",
        "Multiple angles",
        "White background",
        "E-commerce ready"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Page Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4 animate-fade-in">
            Our Services
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-light text-foreground mb-6 animate-fade-up">
            Capturing Life's <span className="italic text-primary">Beautiful Moments</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-up">
            From intimate celebrations to grand events, we're here to tell your story through stunning imagery.
            Every package is designed to give you beautiful, lasting memories.
          </p>
        </div>
      </section>

      {/* WEDDINGS & CELEBRATIONS */}
      <ServiceHero
        title="Weddings & Celebrations"
        subtitle="For the wildly in love"
        description="Your love story deserves to be told beautifully. We capture every emotion, every tear of joy, and every precious moment of your special day with artistry and heart."
        imageKeys={["service-wedding", "wedding-gallery-1", "wedding-gallery-2"]}
        icon={Heart}
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          {/* Photography Packages */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4">Photography Packages</Badge>
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                Wedding <span className="italic text-primary">Photography</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Professional photography packages to capture every moment of your special day
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {photographyPackages.map((pkg, idx) => (
                <PackageCard
                  key={idx}
                  pkg={pkg}
                  category="Photography"
                  isPopular={pkg.name === "One Day Gold"}
                />
              ))}
            </div>
          </div>

          {/* Videography Packages */}
          <div>
            <div className="text-center mb-12">
              <Badge className="mb-4">Videography Packages</Badge>
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                Wedding <span className="italic text-primary">Videography</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Relive your special day with cinematic wedding films
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videographyPackages.map((pkg, idx) => (
                <PackageCard
                  key={idx}
                  pkg={pkg}
                  category="Videography"
                  isPopular={pkg.name === "One Day Diamond"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS & MILESTONES */}
      <ServiceHero
        title="Events & Milestones"
        subtitle="Every moment matters"
        description="Life is made of beautiful moments worth celebrating. From birthdays to naming ceremonies, we document your joy with vibrant, heartfelt photography."
        imageKeys={["service-event", "event-gallery-1", "event-gallery-2"]}
        icon={PartyPopper}
      />

      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Celebration <span className="italic text-primary">Photography</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Flat-rate pricing for life's special celebrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventServices.map((service, idx) => (
              <EventServiceCard key={idx} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* PROFESSIONAL SERVICES */}
      <ServiceHero
        title="Professional Services"
        subtitle="Elevate your brand"
        description="Polished, professional imagery for businesses and individuals. From corporate events to executive portraits, we deliver results that make an impact."
        imageKeys={["service-corporate", "service-product", "portrait-gallery-1"]}
        icon={Building2}
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Business <span className="italic text-primary">Photography</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional imagery that elevates your brand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionalServices.map((service, idx) => (
              <EventServiceCard key={idx} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Extras Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
              Enhance Your Package
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Extras & <span className="italic text-primary">Add-ons</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Customize your experience with additional services and premium products
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extras.flatMap(category =>
              category.items.map((item, idx) => (
                <div
                  key={`${category.category}-${idx}`}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                    <span className="font-display text-primary whitespace-nowrap ml-2">
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-12">
            <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Ready to <span className="italic text-primary">Create Magic?</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your vision and create something beautiful together. Every story is unique,
              and we're here to capture yours perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button variant="hero" size="xl" className="group">
                  <Calendar className="mr-2" />
                  Book Your Session
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="elegant" size="xl">
                  Request Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
