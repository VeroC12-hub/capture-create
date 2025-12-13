import { useState, useEffect } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomepageGalleryManager } from "@/components/admin/HomepageGalleryManager";
import { ClientGalleryManager } from "@/components/admin/ClientGalleryManager";
import { BookingsManager } from "@/components/admin/BookingsManager";
import { GoogleDriveConnect } from "@/components/admin/GoogleDriveConnect";
import SiteImagesManager from "@/components/admin/SiteImagesManager";
import {
  Image as ImageIcon,
  FolderOpen,
  Calendar,
  LogOut,
  Home,
  Loader2,
  Settings,
  Images,
} from "lucide-react";

const Admin = () => {
  const { user, session, isAdmin, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("site-images");
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle Google OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const isGoogleCallback = searchParams.get('google_callback');
    
    if (code && isGoogleCallback && session) {
      const redirectUri = `${window.location.origin}/admin?google_callback=true`;
      
      fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=callback&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      ).then(() => {
        setSearchParams({});
      });
    }
  }, [searchParams, session, setSearchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl">
              Admin <span className="italic text-primary">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                View Site
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="site-images" className="flex items-center gap-2">
              <Images className="w-4 h-4" />
              <span className="hidden sm:inline">Site Images</span>
              <span className="sm:hidden">Images</span>
            </TabsTrigger>
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Homepage Gallery</span>
              <span className="sm:hidden">Homepage</span>
            </TabsTrigger>
            <TabsTrigger value="galleries" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Client Galleries</span>
              <span className="sm:hidden">Galleries</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
              <span className="sm:hidden">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site-images">
            <SiteImagesManager />
          </TabsContent>

          <TabsContent value="homepage">
            <HomepageGalleryManager />
          </TabsContent>

          <TabsContent value="galleries">
            <ClientGalleryManager />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsManager />
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl mb-4">Integrations</h2>
                <GoogleDriveConnect />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
