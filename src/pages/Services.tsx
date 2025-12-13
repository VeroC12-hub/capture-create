import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Camera, Heart, Building2, Package, PartyPopper, Film, Check } from "lucide-react";
import heroWedding from "@/assets/hero-wedding.jpg";

const services = [
  {
    id: "wedding",
    icon: Heart,
    title: "Wedding Photography",
    description: "Your love story deserves to be told beautifully. We capture every emotion, every tear of joy, and every precious moment of your special day.",
    features: [
      "Full-day coverage (8-12 hours)",
      "Second photographer included",
      "Engagement session",
      "High-resolution edited images",
      "Online gallery for sharing",
      "Premium wedding album"
    ],
    startingPrice: "$2,500"
  },
  {
    id: "portrait",
    icon: Camera,
    title: "Portrait Sessions",
    description: "Professional portraits that capture your unique personality. Perfect for individuals, couples, families, and professional headshots.",
    features: [
      "1-2 hour session",
      "Multiple outfit changes",
      "Indoor or outdoor location",
      "Professional retouching",
      "25+ edited images",
      "Print-ready files"
    ],
    startingPrice: "$300"
  },
  {
    id: "corporate",
    icon: Building2,
    title: "Corporate Photography",
    description: "Elevate your brand with polished corporate imagery. From headshots to team photos and office environment shots.",
    features: [
      "Professional headshots",
      "Team & group photos",
      "Office environment shots",
      "Quick turnaround",
      "Consistent brand style",
      "Commercial usage rights"
    ],
    startingPrice: "$500"
  },
  {
    id: "events",
    icon: PartyPopper,
    title: "Event Coverage",
    description: "Every celebration tells a story. We document your events with candid, energetic photography that captures the atmosphere.",
    features: [
      "Full event coverage",
      "Candid & posed shots",
      "Fast delivery",
      "Online gallery",
      "Social media ready",
      "Highlight collection"
    ],
    startingPrice: "$800"
  },
  {
    id: "product",
    icon: Package,
    title: "Product Photography",
    description: "High-end product imagery that sells. Perfect for e-commerce, catalogs, and marketing materials.",
    features: [
      "Studio or on-location",
      "Clean white backgrounds",
      "Lifestyle product shots",
      "Color accurate editing",
      "Web optimized files",
      "Commercial usage rights"
    ],
    startingPrice: "$200"
  },
  {
    id: "documentary",
    icon: Film,
    title: "Documentary Photography",
    description: "Authentic storytelling through candid, journalistic imagery. Perfect for personal projects and publications.",
    features: [
      "Storytelling approach",
      "Natural moments",
      "Extended coverage",
      "Black & white options",
      "Custom packages",
      "Publication ready"
    ],
    startingPrice: "Custom Quote"
  }
];

const Services = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={heroWedding} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-secondary/95" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            What We Offer
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
            Our <span className="italic text-primary">Services</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional photography services tailored to capture your most important moments with artistry and elegance.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`flex flex-col lg:flex-row gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Info */}
                <div className="flex-1">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-foreground">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting at</p>
                      <p className="font-display text-3xl text-primary">{service.startingPrice}</p>
                    </div>
                    <Link to="/booking">
                      <Button variant="hero" size="lg">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full">
                  <div className="bg-card border border-border rounded-lg aspect-[4/3] flex items-center justify-center">
                    <service.icon className="w-24 h-24 text-primary/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
