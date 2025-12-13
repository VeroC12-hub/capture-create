import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Camera, Heart, Building2, Package, PartyPopper, Film, ArrowRight } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImages";

const ServiceCard = ({
  id,
  icon: Icon,
  title,
  tagline,
  description,
  imageKey,
  startingPrice,
  index,
}: {
  id: string;
  icon: any;
  title: string;
  tagline: string;
  description: string;
  imageKey: string;
  startingPrice: string;
  index: number;
}) => {
  const { imageUrl } = useSiteImage(imageKey);

  return (
    <div
      className={`flex flex-col lg:flex-row gap-12 items-center ${
        index % 2 === 1 ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image */}
      <div className="flex-1 w-full">
        <Link to={`/services/${id}`} className="block group">
          <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-2">
          {tagline}
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Starting at</p>
            <p className="font-display text-3xl text-primary">{startingPrice}</p>
          </div>
          <Link to={`/services/${id}`}>
            <Button variant="hero" size="lg">
              Learn More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const services = [
  {
    id: "wedding",
    icon: Heart,
    title: "Wedding Photography",
    tagline: "For the wildly in love",
    description: "Your love story deserves to be told beautifully. We capture every emotion, every tear of joy, and every precious moment of your special day.",
    imageKey: "service-wedding",
    startingPrice: "$2,500"
  },
  {
    id: "portrait",
    icon: Camera,
    title: "Portrait Sessions",
    tagline: "Reveal your authentic self",
    description: "Professional portraits that capture your unique personality. Perfect for individuals, couples, families, and professional headshots.",
    imageKey: "service-portrait",
    startingPrice: "$300"
  },
  {
    id: "corporate",
    icon: Building2,
    title: "Corporate Photography",
    tagline: "Elevate your brand image",
    description: "Polished corporate imagery for your brand. From headshots to team photos and office environment shots.",
    imageKey: "service-corporate",
    startingPrice: "$200"
  },
  {
    id: "events",
    icon: PartyPopper,
    title: "Event Coverage",
    tagline: "Every moment matters",
    description: "Every celebration tells a story. We document your events with candid, energetic photography.",
    imageKey: "service-event",
    startingPrice: "$800"
  },
  {
    id: "product",
    icon: Package,
    title: "Product Photography",
    tagline: "Images that sell",
    description: "High-end product imagery that sells. Perfect for e-commerce, catalogs, and marketing materials.",
    imageKey: "service-product",
    startingPrice: "$200"
  },
  {
    id: "documentary",
    icon: Film,
    title: "Documentary Photography",
    tagline: "Stories worth telling",
    description: "Authentic storytelling through candid, journalistic imagery. Perfect for personal projects and publications.",
    imageKey: "service-documentary",
    startingPrice: "Custom"
  }
];

const Services = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary relative overflow-hidden">
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

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {services.map((service, index) => (
              <ServiceCard key={service.id} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
