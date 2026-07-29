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
        {/* Scrim: the hero image is client-managed and can be any brightness, so
            the text sits on its own darkened layer rather than relying on the
            photo being pale. Heaviest through the middle where the copy sits. */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/55 to-charcoal/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-display text-2xl md:text-3xl font-light italic text-cream mb-4 tracking-wider animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards", textShadow: "0 2px 12px rgba(0,0,0,0.55)", letterSpacing: "0.1em" }}>
            SamBlessing Photography
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-cream mb-8 leading-tight animate-fade-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
            Capturing
            <span className="block italic text-gold-light">Priceless Moments</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <Link to="/portfolio">
              <Button variant="hero" size="lg">
                View Portfolio
              </Button>
            </Link>
            <Link to="/booking">
              <Button variant="gold" size="lg">
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
