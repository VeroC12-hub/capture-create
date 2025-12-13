import { Link } from "react-router-dom";
import { Camera, Heart, Building2, Package, PartyPopper, Film } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImages";

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  link, 
  imageKey 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  link: string; 
  imageKey: string;
}) => {
  const { imageUrl } = useSiteImage(imageKey);

  return (
    <Link
      to={link}
      className="group relative overflow-hidden rounded-lg aspect-[4/5]"
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/40 transition-colors">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <h3 className="font-display text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

const services = [
  {
    icon: Heart,
    title: "Wedding",
    description: "Timeless memories of your special day captured with elegance and emotion",
    link: "/services/wedding",
    imageKey: "service-wedding"
  },
  {
    icon: Camera,
    title: "Portrait",
    description: "Professional portraits that reveal your unique personality and style",
    link: "/services/portrait",
    imageKey: "service-portrait"
  },
  {
    icon: Building2,
    title: "Corporate",
    description: "Polished imagery for your brand, team, and professional needs",
    link: "/services/corporate",
    imageKey: "service-corporate"
  },
  {
    icon: PartyPopper,
    title: "Events",
    description: "Every celebration deserves to be documented beautifully",
    link: "/services/events",
    imageKey: "service-event"
  },
  {
    icon: Package,
    title: "Product",
    description: "High-end product photography that sells your brand story",
    link: "/services/product",
    imageKey: "service-product"
  },
  {
    icon: Film,
    title: "Documentary",
    description: "Authentic storytelling through candid, journalistic imagery",
    link: "/services/documentary",
    imageKey: "service-documentary"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            What We Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Our <span className="italic text-primary">Services</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
