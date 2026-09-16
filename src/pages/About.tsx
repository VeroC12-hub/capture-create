import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Building2, Camera, Heart, Users } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImages";

/**
 * Facts only Sam can confirm.
 *
 * The previous version of this page shipped invented figures — "500+ Happy
 * Clients", "1,200+ Photo Sessions", "50+ Awards Won" — none of which came from
 * him. Anything left empty here simply does not render, so the site can never
 * publish a claim nobody verified. Fill a value in and its tile appears.
 */
const STUDIO_FACTS: { number: string; label: string }[] = [
  { number: "", label: "Years Photographing" },
  { number: "", label: "Weddings Covered" },
  { number: "", label: "Events Documented" },
  { number: "", label: "Corporate Clients" },
];

/**
 * Sectors evidenced by actual delivered work, rather than generic adjectives.
 * Keep this honest — it is the part a prospective client will check.
 */
const disciplines = [
  {
    icon: Heart,
    title: "Weddings & Traditional Ceremonies",
    description:
      "Engagements, traditional marriages and receptions — from the kente and the knocking to the last dance of the night.",
  },
  {
    icon: Users,
    title: "Events & Celebrations",
    description:
      "Birthdays, milestones, launches and private functions, covered discreetly so the room never notices the camera.",
  },
  {
    icon: Building2,
    title: "Corporate & Industrial",
    description:
      "Commissionings, conferences and site work for mining, manufacturing and hospitality clients across Ghana.",
  },
  {
    icon: Camera,
    title: "Portraits & Brand Work",
    description:
      "Graduations, professional headshots, product and lifestyle photography for businesses building a presence.",
  },
];

const About = () => {
  const heroImage = useSiteImage("service-portrait");
  const storyImage1 = useSiteImage("wedding-gallery-1");
  const storyImage2 = useSiteImage("portrait-gallery-1");
  const storyImage3 = useSiteImage("event-gallery-1");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* The photograph runs clean and the words sit underneath it.
          This header used to fade the image into the page background so dark
          text could be read on top of it, which washed the photograph out to
          about a third of its brightness. Nothing covers it now. */}
      <section className="pt-20">
        <div className="w-full h-[44vh] min-h-[280px] overflow-hidden">
          <img
            src={heroImage.imageUrl}
            alt="About our photography studio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-6 text-center py-14 md:py-16">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Our Story
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
            About <span className="italic text-primary">Us</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            A photography and videography studio in Dawhenya, Ghana — covering
            weddings, celebrations and corporate work across the country.
          </p>
        </div>
      </section>

      {/* Figures — only rendered once real ones are supplied, so the page never
          shows an unverified claim or an empty tile. */}
      {STUDIO_FACTS.some((s) => s.number.trim()) && (
        <section className="py-16 bg-background border-b border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STUDIO_FACTS.filter((s) => s.number.trim()).map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl md:text-5xl text-primary mb-2">
                    {stat.number}
                  </p>
                  <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Story with Images */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                  Capturing <span className="italic text-primary">Moments</span> That Matter
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    SamBlessing Photography is a Ghanaian studio based in Dawhenya,
                    working across Accra, Tema and wherever the story takes us.
                  </p>
                  <p>
                    The work runs from traditional marriages and receptions to
                    industrial commissionings and corporate events — the kente and
                    the celebration on one weekend, hard hats and plant floors the
                    next. Both deserve the same care.
                  </p>
                  <p>
                    Every frame is shot and finished by hand, and every client
                    leaves with their photographs at full resolution, delivered
                    through their own private gallery.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  <img src={storyImage1.imageUrl} alt="Our work" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  <img src={storyImage2.imageUrl} alt="Our work" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="col-span-2 relative overflow-hidden rounded-lg aspect-[2/1]">
                  <img src={storyImage3.imageUrl} alt="Our work" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
              What We Shoot
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              Our <span className="italic text-primary">Work</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {disciplines.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Ready to <span className="italic text-primary">Work Together?</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Let's create something beautiful. Get in touch to discuss your project.
          </p>
          <Link to="/booking">
            <Button variant="hero" size="xl">
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
