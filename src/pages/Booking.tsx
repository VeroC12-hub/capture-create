import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Check, Camera, Video, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { photographyPackages, videographyPackages, allPackages } from "@/data/pricingData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [serviceType, setServiceType] = useState<"photography" | "videography">("photography");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (value: string) => {
    setServiceType(value as "photography" | "videography");
    setSelectedPackage(""); // Reset selection when changing tabs
  };

  const currentPackages = serviceType === "photography" ? photographyPackages : videographyPackages;
  const selectedPkg = allPackages.find(pkg =>
    pkg.name === selectedPackage && pkg.type === serviceType
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackage) {
      toast({
        title: "Please select a package",
        description: "Choose a photography or videography package to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        service_type: `${serviceType}-${selectedPackage}`,
        preferred_date: formData.preferredDate || null,
        message: formData.message || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking Request Received!",
        description: "We'll get back to you within 24 hours to confirm your session and discuss details.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        message: "",
      });
      setSelectedPackage("");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly via phone or WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Let's Create Together
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
            Book Your <span className="italic text-primary">Package</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Fill out the form below and we'll get back to you within 24 hours to discuss your photography needs.
          </p>
          <div className="flex justify-center">
            <Link to="/pricing">
              <Button variant="elegant" size="sm">
                <Info className="w-4 h-4 mr-2" />
                View Full Pricing Details
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Package Selection */}
              <div>
                <h2 className="font-display text-2xl text-foreground mb-6">
                  Select Your Package
                </h2>

                <Tabs value={serviceType} onValueChange={handleTabChange} className="w-full mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                    <TabsTrigger value="photography" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Photography
                    </TabsTrigger>
                    <TabsTrigger value="videography" className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Videography
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="photography" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {photographyPackages.map((pkg) => (
                        <button
                          key={pkg.name}
                          type="button"
                          onClick={() => setSelectedPackage(pkg.name)}
                          className={`p-6 rounded-lg border text-left transition-all duration-300 ${
                            selectedPackage === pkg.name
                              ? "border-primary bg-primary/10 ring-2 ring-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-display text-xl text-foreground mb-1">
                                {pkg.name}
                              </h3>
                              <p className="font-display text-2xl text-primary">{pkg.price}</p>
                            </div>
                            {selectedPackage === pkg.name && (
                              <Check className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {pkg.coverage.join(" • ")}
                          </p>
                          <ul className="space-y-1">
                            {pkg.includes.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                            {pkg.includes.length > 3 && (
                              <li className="text-xs text-primary">
                                +{pkg.includes.length - 3} more items
                              </li>
                            )}
                          </ul>
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="videography" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videographyPackages.map((pkg) => (
                        <button
                          key={pkg.name}
                          type="button"
                          onClick={() => setSelectedPackage(pkg.name)}
                          className={`p-6 rounded-lg border text-left transition-all duration-300 ${
                            selectedPackage === pkg.name
                              ? "border-primary bg-primary/10 ring-2 ring-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-display text-xl text-foreground mb-1">
                                {pkg.name}
                              </h3>
                              <p className="font-display text-2xl text-primary">{pkg.price}</p>
                            </div>
                            {selectedPackage === pkg.name && (
                              <Check className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {pkg.coverage.join(" • ")}
                          </p>
                          <ul className="space-y-1">
                            {pkg.includes.map((item, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {selectedPkg && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <Info className="w-4 h-4 text-primary" />
                    <AlertDescription className="text-sm">
                      You've selected <strong>{selectedPkg.name}</strong> ({selectedPkg.type}) at{" "}
                      <strong>{selectedPkg.price}</strong>. Need add-ons or customization?{" "}
                      <Link to="/pricing" className="text-primary underline">
                        View full pricing
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="font-display text-2xl text-foreground mb-6">
                  Your Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-card border-border"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-card border-border"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-card border-border"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Event Date</Label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="bg-card border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h2 className="font-display text-2xl text-foreground mb-6">
                  Tell Us More
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Details</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="bg-card border-border resize-none"
                    placeholder="Share any specific requirements, location preferences, add-ons you'd like, or questions..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Mention any extras you'd like to add (drone coverage, additional photographer, photobooks, etc.)
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                By submitting this form, you agree to our booking terms. A 50% deposit is required to secure your date.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Booking;
