import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Award, Camera, Heart, Users } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImages";

const stats = [
  { number: "500+", label: "Happy Clients" },
  { number: "1,200+", label: "Photo Sessions" },
  { number: "10+", label: "Years Experience" },
  { number: "50+", label: "Awards Won" },
];

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "Photography isn't just our profession—it's our calling. Every click is driven by love for the craft."
  },
  {
    icon: Camera,
    title: "Artistry",
    description: "We blend technical excellence with creative vision to create images that transcend the ordinary."
  },
  {
    icon: Users,
    title: "Connection",
    description: "Building genuine relationships with our clients allows us to capture authentic, meaningful moments."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We never settle. Every project receives our complete dedication and meticulous attention to detail."
  }
];

const About = () => {
  const heroImage = useSiteImage("service-portrait");
  const storyImage1 = useSiteImage("wedding-gallery-1");
  const storyImage2 = useSiteImage("portrait-gallery-1");
  const storyImage3 = useSiteImage("event-gallery-1");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with Background Image */}
      <section className="relative pt-32 pb-16 min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage.imageUrl}
            alt="About our photography studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Our Story
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
            About <span className="italic text-primary">Us</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate photographers dedicated to capturing life's most precious moments with artistry and heart.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
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
                    Founded over a decade ago, our studio began with a simple mission: to create photographs that don't just document moments, but truly capture the emotions within them.
                  </p>
                  <p>
                    What started as a passion project has grown into a full-service photography studio serving clients across weddings, corporate events, portraits, and commercial projects.
                  </p>
                  <p>
                    Our approach combines technical excellence with artistic vision, ensuring every image we create is both beautiful and meaningful. We believe that photography is about connection—between the photographer and subject, between the image and viewer.
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
              What Drives Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              Our <span className="italic text-primary">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-3">
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
