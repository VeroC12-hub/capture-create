import { Link } from "react-router-dom";
import { Camera, Heart, Building2, Package, PartyPopper, Film } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Wedding",
    description: "Timeless memories of your special day captured with elegance and emotion",
    link: "/services#wedding"
  },
  {
    icon: Camera,
    title: "Portrait",
    description: "Professional portraits that reveal your unique personality and style",
    link: "/services#portrait"
  },
  {
    icon: Building2,
    title: "Corporate",
    description: "Polished imagery for your brand, team, and professional needs",
    link: "/services#corporate"
  },
  {
    icon: PartyPopper,
    title: "Events",
    description: "Every celebration deserves to be documented beautifully",
    link: "/services#events"
  },
  {
    icon: Package,
    title: "Product",
    description: "High-end product photography that sells your brand story",
    link: "/services#product"
  },
  {
    icon: Film,
    title: "Documentary",
    description: "Authentic storytelling through candid, journalistic imagery",
    link: "/services#documentary"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.link}
              className="group"
            >
              <div className="bg-card border border-border rounded-lg p-8 h-full transition-all duration-500 hover:border-primary/50 hover:shadow-gold hover:-translate-y-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
