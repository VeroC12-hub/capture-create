import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span
              className={`font-display text-2xl md:text-3xl font-semibold italic transition-colors duration-300 ${
                isScrolled ? "text-primary" : "text-cream"
              }`}
              style={isScrolled ? undefined : { textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              SamBlessing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                // Over the hero photograph the bar is transparent, so dark grey
                // links disappear. Light type there, dark once scrolled onto the
                // solid background.
                className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 ${
                  isScrolled
                    ? location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                    : location.pathname === link.path
                      ? "text-gold-light"
                      : "text-cream/90 hover:text-gold-light"
                }`}
                style={isScrolled ? undefined : { textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/client-portal">
              <Button variant="elegant" size="sm">
                Client Portal
              </Button>
            </Link>
            <Link to="/booking">
              <Button variant="hero" size="sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur-lg border-t border-border animate-fade-up">
            <div className="flex flex-col py-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-body text-sm tracking-widest uppercase px-4 py-2 transition-colors ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 px-4 mt-4">
                <Link to="/client-portal" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="elegant" className="w-full">
                    Client Portal
                  </Button>
                </Link>
                <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="hero" className="w-full">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
