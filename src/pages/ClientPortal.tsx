import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2, Calendar, Image as ImageIcon, User, LogOut,
  Home, FolderOpen, Mail, Phone, Lock
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;
type Gallery = Tables<"client_galleries">;

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
  { value: "completed", label: "Completed", color: "bg-blue-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

const ClientPortal = () => {
  const { user, session, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    if (user && !authLoading) {
      fetchUserData();
    }
  }, [user, authLoading]);

  const fetchUserData = async () => {
    if (!user) return;

    setIsLoading(true);

    // Fetch user's bookings by email
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("client_email", user.email)
      .order("created_at", { ascending: false });

    // Fetch user's galleries
    const { data: galleriesData } = await supabase
      .from("client_galleries")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    setBookings(bookingsData || []);
    setGalleries(galleriesData || []);
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <Badge variant="outline" className={`${statusConfig?.color} text-white border-0`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl">
              Client <span className="italic text-primary">Portal</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">My Bookings</span>
                <span className="sm:hidden">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="galleries" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">My Galleries</span>
                <span className="sm:hidden">Galleries</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl">My Booking Requests</h3>
                  <Link to="/booking">
                    <Button>
                      <Calendar className="w-4 h-4 mr-2" />
                      New Booking
                    </Button>
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No bookings yet</p>
                      <Link to="/booking">
                        <Button className="mt-4">Book a Session</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="capitalize">
                                {booking.service_type.replace(/-/g, " ")}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                Submitted on {new Date(booking.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Preferred Date</p>
                              <p className="font-medium">
                                {booking.preferred_date
                                  ? new Date(booking.preferred_date).toLocaleDateString()
                                  : "Not specified"}
                              </p>
                            </div>
                            {booking.message && (
                              <div className="md:col-span-2">
                                <p className="text-muted-foreground">Your Message</p>
                                <p className="mt-1 text-sm bg-muted p-3 rounded">{booking.message}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Galleries Tab */}
            <TabsContent value="galleries">
              <div className="space-y-4">
                <h3 className="font-display text-xl">My Photo Galleries</h3>

                {galleries.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No galleries available yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your galleries will appear here once your photos are ready
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleries.map((gallery) => (
                      <Link key={gallery.id} to={`/gallery/${gallery.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{gallery.title}</CardTitle>
                              {gallery.password && (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            {gallery.event_date && (
                              <CardDescription>
                                {new Date(gallery.event_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </CardDescription>
                            )}
                          </CardHeader>
                          {gallery.description && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {gallery.description}
                              </p>
                            </CardContent>
                          )}
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="max-w-2xl space-y-6">
                <h3 className="font-display text-xl">My Profile</h3>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                          {new Date(user.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-3xl font-bold text-primary">{bookings.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-3xl font-bold text-primary">{galleries.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">Photo Galleries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>Get in touch with us</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href="mailto:Slessing.studio20@gmail.com" className="text-sm hover:text-primary">
                        Slessing.studio20@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href="tel:0543518185" className="text-sm hover:text-primary">
                        0543518185
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default ClientPortal;
