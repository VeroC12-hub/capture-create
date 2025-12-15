import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImages";

const HeroSection = () => {
  const { imageUrl } = useSiteImage("hero-wedding");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="Romantic wedding photography at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 bg-background/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-display text-lg md:text-xl font-medium text-black mb-3 tracking-wide animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards", textShadow: "0 2px 4px rgba(255,255,255,0.5)" }}>
            SamBlessing Photography
          </p>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium text-black mb-6 leading-tight animate-fade-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards", textShadow: "0 2px 4px rgba(255,255,255,0.5)" }}>
            Capturing
            <span className="block italic text-black">Priceless Moments</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 justify-center animate-fade-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <Link to="/portfolio">
              <Button variant="hero" size="sm" className="text-xs">
                View Portfolio
              </Button>
            </Link>
            <Link to="/booking">
              <Button variant="gold" size="sm" className="text-xs">
                Book a Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
