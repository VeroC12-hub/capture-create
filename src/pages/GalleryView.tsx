import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ArrowLeft, Lock, Loader2, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Gallery = Tables<"client_galleries">;
type GalleryPhoto = Tables<"gallery_photos">;

const GalleryView = () => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    fetchGallery();
  }, [galleryId]);

  const fetchGallery = async () => {
    if (!galleryId) return;

    const { data, error } = await supabase
      .from("client_galleries")
      .select("*")
      .eq("id", galleryId)
      .single();

    if (error || !data) {
      setIsLoading(false);
      return;
    }

    setGallery(data);

    // Check if password protected
    if (!data.password) {
      setIsUnlocked(true);
      await fetchPhotos();
    }

    setIsLoading(false);
  };

  const fetchPhotos = async () => {
    if (!galleryId) return;

    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("gallery_id", galleryId)
      .order("sort_order", { ascending: true });

    setPhotos(data || []);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gallery?.password === password) {
      setIsUnlocked(true);
      setPasswordError(false);
      await fetchPhotos();
    } else {
      setPasswordError(true);
    }
  };

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const downloadPhoto = async (photo: GalleryPhoto) => {
    const url = getPublicUrl(photo.file_path);
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = photo.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhoto === null) return;
    if (direction === "prev" && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    } else if (direction === "next" && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Gallery Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This gallery doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md px-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl text-foreground mb-2">
                {gallery.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter the password to view this gallery
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? "border-destructive" : ""}
                />
                {passwordError && (
                  <p className="text-sm text-destructive mt-1">Incorrect password</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                View Gallery
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="font-display text-3xl">{gallery.title}</h1>
          {gallery.description && (
            <p className="text-muted-foreground mt-2">{gallery.description}</p>
          )}
          {gallery.event_date && (
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(gallery.event_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="container mx-auto px-4 py-8">
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No photos in this gallery yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedPhoto(index)}
              >
                <img
                  src={getPublicUrl(photo.file_path)}
                  alt={photo.caption || photo.file_name}
                  className="w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl p-0 bg-foreground/95 border-0">
          {selectedPhoto !== null && photos[selectedPhoto] && (
            <div className="relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 text-background/80 hover:text-background"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={() => downloadPhoto(photos[selectedPhoto])}
                className="absolute top-4 left-4 z-10 text-background/80 hover:text-background flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm">Download</span>
              </button>

              <img
                src={getPublicUrl(photos[selectedPhoto].file_path)}
                alt={photos[selectedPhoto].caption || photos[selectedPhoto].file_name}
                className="w-full max-h-[80vh] object-contain"
              />

              {selectedPhoto > 0 && (
                <button
                  onClick={() => navigatePhoto("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
              )}

              {selectedPhoto < photos.length - 1 && (
                <button
                  onClick={() => navigatePhoto("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-background/80 text-sm">
                {selectedPhoto + 1} / {photos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryView;
