import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImages";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerImage1 = useSiteImage("wedding-gallery-1");
  const footerImage2 = useSiteImage("portrait-gallery-1");
  const footerImage3 = useSiteImage("event-gallery-1");

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2">
          <img src={footerImage1.imageUrl} alt="" className="w-full h-full object-cover" />
          <img src={footerImage2.imageUrl} alt="" className="w-full h-full object-cover" />
          <img src={footerImage3.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Let's Create <span className="italic text-primary">Magic Together</span>
            </h3>
            <Link to="/booking">
              <Button variant="hero" size="lg">
                <Calendar className="mr-2 w-4 h-4" />
                Book Your Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-3xl font-semibold text-primary italic mb-4">
              SamBlessing
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Capturing life's most precious moments with artistry and elegance.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm uppercase tracking-widest text-foreground mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {["Home", "Services", "Portfolio", "About", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-body text-sm uppercase tracking-widest text-foreground mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services#weddings"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Weddings & Celebrations
                </Link>
              </li>
              <li>
                <Link
                  to="/services#events"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Events & Milestones
                </Link>
              </li>
              <li>
                <Link
                  to="/services#professional"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Professional Services
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-sm uppercase tracking-widest text-foreground mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                Slessing.studio20@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary" />
                0543518185
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-1" />
                <span>Community 25, Dawhenya, Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} SamBlessing Photography. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
