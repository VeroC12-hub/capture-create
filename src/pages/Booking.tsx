import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Check, Camera, Video, Info, Heart, PartyPopper, Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { photographyPackages, videographyPackages } from "@/data/pricingData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Service categories
const SERVICE_CATEGORIES = [
  {
    id: "weddings",
    icon: Heart,
    title: "Weddings & Celebrations",
    description: "Full wedding photography and videography packages",
    color: "text-rose-500",
  },
  {
    id: "events",
    icon: PartyPopper,
    title: "Events & Milestones",
    description: "Birthdays, anniversaries, naming ceremonies, festive events",
    color: "text-amber-500",
  },
  {
    id: "professional",
    icon: Building2,
    title: "Professional Services",
    description: "Corporate events, headshots, product photography",
    color: "text-blue-500",
  },
];

// Event packages
const EVENT_PACKAGES = [
  { name: "Birthdays & Anniversaries", price: "GH₵ 2,500", description: "Full event coverage with candid and posed shots" },
  { name: "Naming Ceremonies", price: "GH₵ 2,000", description: "Complete ceremony coverage and family portraits" },
  { name: "Festive Events", price: "GH₵ 3,500", description: "Holiday celebrations and special gatherings" },
];

// Professional packages
const PROFESSIONAL_PACKAGES = [
  { name: "Corporate Events", price: "GH₵ 2,200", description: "Professional event coverage and documentation" },
  { name: "Headshots & Portraits", price: "From GH₵ 500", description: "Individual or team headshots for business use" },
  { name: "Product Photography", price: "From GH₵ 200", description: "High-quality product images for marketing and e-commerce" },
];

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<"photography" | "videography" | "">("");
  const [selectedPackage, setSelectedPackage] = useState<string>("");
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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedServiceType("");
    setSelectedPackage("");
    if (categoryId === "weddings") {
      setStep(2); // Go to type selection for weddings
    } else {
      setStep(3); // Skip to package selection for events/professional
    }
  };

  const handleServiceTypeSelect = (type: "photography" | "videography") => {
    setSelectedServiceType(type);
    setSelectedPackage("");
    setStep(3);
  };

  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(packageName);
    setStep(4);
  };

  const getPackagePrice = () => {
    if (selectedCategory === "weddings") {
      if (selectedServiceType === "photography") {
        const pkg = photographyPackages.find(p => p.name === selectedPackage);
        return pkg?.price || "";
      } else if (selectedServiceType === "videography") {
        const pkg = videographyPackages.find(p => p.name === selectedPackage);
        return pkg?.price || "";
      }
    } else if (selectedCategory === "events") {
      const pkg = EVENT_PACKAGES.find(p => p.name === selectedPackage);
      return pkg?.price || "";
    } else if (selectedCategory === "professional") {
      const pkg = PROFESSIONAL_PACKAGES.find(p => p.name === selectedPackage);
      return pkg?.price || "";
    }
    return "";
  };

  const getServiceTypeLabel = () => {
    if (selectedServiceType === "photography") return "Photography";
    if (selectedServiceType === "videography") return "Videography";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackage || !selectedCategory) {
      toast({
        title: "Please complete all steps",
        description: "Select a service category and package to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build service type string
      let serviceTypeString = selectedCategory;
      if (selectedCategory === "weddings" && selectedServiceType) {
        serviceTypeString = `${selectedCategory}-${selectedServiceType}`;
      }
      serviceTypeString += `-${selectedPackage}`;

      const { error } = await supabase.from("bookings").insert({
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        service_type: serviceTypeString,
        preferred_date: formData.preferredDate || null,
        message: formData.message || null,
        status: "pending",
        user_id: user?.id || null, // Link to authenticated user if logged in
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
      setSelectedCategory("");
      setSelectedServiceType("");
      setStep(1);
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
            Book Your <span className="italic text-primary">Service</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Select your service type, choose a package, and we'll get back to you within 24 hours.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/services">
              <Button variant="elegant" size="sm">
                <Info className="w-4 h-4 mr-2" />
                View All Services & Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Progress Indicator */}
      {step > 1 && (
        <section className="py-8 bg-background border-b border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                {["Service", ...(selectedCategory === "weddings" ? ["Type", "Package"] : ["Package"]), "Details"].map((label, index) => {
                  const stepNumber = index + 1;
                  const isActive = step === stepNumber;
                  const isCompleted = step > stepNumber;
                  return (
                    <div key={stepNumber} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                          isCompleted ? "bg-primary text-primary-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                        </div>
                        <span className={`text-xs mt-2 hidden sm:block ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {label}
                        </span>
                      </div>
                      {stepNumber < (selectedCategory === "weddings" ? 4 : 3) && (
                        <div className={`h-0.5 flex-1 -mt-6 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">

            {/* Step 1: Select Service Category */}
            {step === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h2 className="font-display text-3xl text-foreground mb-4">
                    What type of <span className="italic text-primary">service</span> do you need?
                  </h2>
                  <p className="text-muted-foreground">
                    Choose the category that best fits your needs
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SERVICE_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Card
                        key={category.id}
                        className="cursor-pointer transition-all hover:shadow-lg hover:border-primary group"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className={`w-8 h-8 ${category.color}`} />
                            </div>
                          </div>
                          <CardTitle className="text-xl">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                            Select <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Select Photography/Videography (Weddings Only) */}
            {step === 2 && selectedCategory === "weddings" && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h2 className="font-display text-3xl text-foreground mb-4">
                    Choose <span className="italic text-primary">Photography</span> or <span className="italic text-primary">Videography</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Select the type of service for your wedding
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <Card
                    className="cursor-pointer transition-all hover:shadow-lg hover:border-primary group"
                    onClick={() => handleServiceTypeSelect("photography")}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Camera className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl">Photography</CardTitle>
                      <CardDescription>Capture still moments of your special day</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        Select Photography <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer transition-all hover:shadow-lg hover:border-primary group"
                    onClick={() => handleServiceTypeSelect("videography")}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Video className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl">Videography</CardTitle>
                      <CardDescription>Record moving memories and emotions</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        Select Videography <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center mt-8">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Categories
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Select Package */}
            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h2 className="font-display text-3xl text-foreground mb-4">
                    Choose Your <span className="italic text-primary">Package</span>
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedCategory === "weddings" && `${getServiceTypeLabel()} packages for your special day`}
                    {selectedCategory === "events" && "Event coverage packages"}
                    {selectedCategory === "professional" && "Professional service packages"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weddings - Photography Packages */}
                  {selectedCategory === "weddings" && selectedServiceType === "photography" && photographyPackages.map((pkg) => (
                    <Card
                      key={pkg.name}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedPackage === pkg.name ? "border-primary ring-2 ring-primary bg-primary/5" : "hover:border-primary"
                      }`}
                      onClick={() => handlePackageSelect(pkg.name)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{pkg.name}</CardTitle>
                            <p className="text-2xl font-display text-primary mt-2">{pkg.price}</p>
                          </div>
                          {selectedPackage === pkg.name && (
                            <Check className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {pkg.coverage.join(" • ")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pkg.includes.slice(0, 4).map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                          {pkg.includes.length > 4 && (
                            <li className="text-sm text-primary">
                              +{pkg.includes.length - 4} more items
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Weddings - Videography Packages */}
                  {selectedCategory === "weddings" && selectedServiceType === "videography" && videographyPackages.map((pkg) => (
                    <Card
                      key={pkg.name}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedPackage === pkg.name ? "border-primary ring-2 ring-primary bg-primary/5" : "hover:border-primary"
                      }`}
                      onClick={() => handlePackageSelect(pkg.name)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{pkg.name}</CardTitle>
                            <p className="text-2xl font-display text-primary mt-2">{pkg.price}</p>
                          </div>
                          {selectedPackage === pkg.name && (
                            <Check className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {pkg.coverage.join(" • ")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pkg.includes.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Events Packages */}
                  {selectedCategory === "events" && EVENT_PACKAGES.map((pkg) => (
                    <Card
                      key={pkg.name}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedPackage === pkg.name ? "border-primary ring-2 ring-primary bg-primary/5" : "hover:border-primary"
                      }`}
                      onClick={() => handlePackageSelect(pkg.name)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{pkg.name}</CardTitle>
                            <p className="text-2xl font-display text-primary mt-2">{pkg.price}</p>
                          </div>
                          {selectedPackage === pkg.name && (
                            <Check className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}

                  {/* Professional Packages */}
                  {selectedCategory === "professional" && PROFESSIONAL_PACKAGES.map((pkg) => (
                    <Card
                      key={pkg.name}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedPackage === pkg.name ? "border-primary ring-2 ring-primary bg-primary/5" : "hover:border-primary"
                      }`}
                      onClick={() => handlePackageSelect(pkg.name)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{pkg.name}</CardTitle>
                            <p className="text-2xl font-display text-primary mt-2">{pkg.price}</p>
                          </div>
                          {selectedPackage === pkg.name && (
                            <Check className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Button variant="ghost" onClick={() => setStep(selectedCategory === "weddings" ? 2 : 1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Contact Form */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h2 className="font-display text-3xl text-foreground mb-4">
                    Your <span className="italic text-primary">Information</span>
                  </h2>
                  <p className="text-muted-foreground">
                    We'll contact you within 24 hours to confirm details
                  </p>
                </div>

                {/* Selection Summary */}
                <Alert className="bg-primary/5 border-primary/20">
                  <Check className="w-4 h-4 text-primary" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p><strong>Service:</strong> {SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.title}</p>
                      {selectedServiceType && <p><strong>Type:</strong> {getServiceTypeLabel()}</p>}
                      <p><strong>Package:</strong> {selectedPackage}</p>
                      <p><strong>Price:</strong> {getPackagePrice()}</p>
                    </div>
                  </AlertDescription>
                </Alert>

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

                <div className="flex gap-4 justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 w-5 h-5" />
                        Submit Booking Request
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  By submitting this form, you agree to our booking terms. A 50% deposit is required to secure your date.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Booking;
