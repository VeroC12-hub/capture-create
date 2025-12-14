import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Camera, Video, Star, Calendar, MessageCircle, DollarSign } from "lucide-react";
import { photographyPackages, videographyPackages, extras } from "@/data/pricingData";

const PackageCard = ({ pkg, isPopular }: { pkg: any; isPopular?: boolean }) => {
  return (
    <Card className={`relative transition-all duration-300 hover:shadow-xl ${
      isPopular ? "border-primary border-2 scale-105" : "border-border"
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground px-4 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="font-display text-2xl mb-2">{pkg.name}</CardTitle>
        <div className="font-display text-4xl text-primary mb-2">{pkg.price}</div>
        <CardDescription className="text-sm">
          {pkg.coverage.join(" • ")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
            Package Includes:
          </h4>
          <ul className="space-y-2">
            {pkg.includes.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {pkg.highlights.map((highlight: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link to="/booking" className="w-full">
          <Button
            variant={isPopular ? "hero" : "elegant"}
            className="w-full"
            size="lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book This Package
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const ExtrasSection = ({ extra }: { extra: any }) => {
  return (
    <div className="mb-8">
      <h3 className="font-display text-2xl text-foreground mb-4">{extra.category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {extra.items.map((item: any, idx: number) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-foreground">{item.name}</h4>
              <span className="font-display text-lg text-primary whitespace-nowrap ml-2">
                {item.price}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Services = () => {
  const [activeTab, setActiveTab] = useState("photography");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Services & Pricing
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
            Our <span className="italic text-primary">Packages</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional photography and videography packages designed to capture your special moments.
            All prices are in Ghana Cedis (GH₵).
          </p>
        </div>
      </section>

      {/* Main Packages */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="photography" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Photography
                </TabsTrigger>
                <TabsTrigger value="videography" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Videography
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="photography" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  Photography <span className="italic text-primary">Packages</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Choose the perfect photography package for your special day
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {photographyPackages.map((pkg, idx) => (
                  <PackageCard
                    key={idx}
                    pkg={pkg}
                    isPopular={pkg.name === "One Day Gold"}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videography" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  Videography <span className="italic text-primary">Packages</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Preserve your memories with professional videography
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videographyPackages.map((pkg, idx) => (
                  <PackageCard
                    key={idx}
                    pkg={pkg}
                    isPopular={pkg.name === "One Day Diamond"}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Extras & Add-ons */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
              Customize Your Experience
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Extras & <span className="italic text-primary">Add-ons</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhance your package with additional services and products
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {extras.map((extra, idx) => (
              <ExtrasSection key={idx} extra={extra} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Packages CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-12 text-center">
            <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Need a <span className="italic text-primary">Custom Package?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have specific requirements or looking for something unique? We'd love to create a
              custom package tailored to your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="hero" size="xl">
                  <MessageCircle className="mr-2" />
                  Request Custom Quote
                </Button>
              </Link>
              <Link to="/booking">
                <Button variant="elegant" size="xl">
                  <Calendar className="mr-2" />
                  Book a Package
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-display text-2xl text-foreground mb-6">
              Important <span className="italic text-primary">Information</span>
            </h3>
            <div className="space-y-4 text-left">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Payment Terms
                </h4>
                <p className="text-sm text-muted-foreground">
                  A 50% deposit is required to secure your booking date. The remaining balance is due
                  7 days before your event. We accept mobile money, bank transfers, and cash payments.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Delivery Timeline
                </h4>
                <p className="text-sm text-muted-foreground">
                  High-resolution images are typically delivered within 2-4 weeks after your event.
                  Videos take 4-6 weeks for complete editing. Sneak peeks are provided within 48 hours.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Booking Policy
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dates are reserved upon deposit payment. Cancellations made 30+ days before the
                  event receive a 50% refund. Contact us to discuss rescheduling options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
