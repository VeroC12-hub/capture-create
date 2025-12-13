import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Michael",
    event: "Wedding",
    quote: "They captured every emotion, every tear of joy, every laugh. Looking at our photos feels like reliving the happiest day of our lives.",
    rating: 5
  },
  {
    name: "Jennifer Liu",
    event: "Corporate Event",
    quote: "Professional, punctual, and incredibly talented. The corporate headshots elevated our entire brand presence.",
    rating: 5
  },
  {
    name: "David Chen",
    event: "Product Photography",
    quote: "Our product sales increased 40% after using their stunning product photography. Worth every penny.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Client Stories
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-16">
            What Our <span className="italic text-primary">Clients Say</span>
          </h2>

          {/* Testimonial */}
          <div className="relative">
            <Quote className="w-16 h-16 text-primary/20 mx-auto mb-8" />
            
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed mb-8 italic">
              "{testimonials[currentIndex].quote}"
            </blockquote>

            <div className="mb-8">
              <p className="font-body text-lg text-foreground">
                {testimonials[currentIndex].name}
              </p>
              <p className="font-body text-sm text-primary uppercase tracking-widest">
                {testimonials[currentIndex].event}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
