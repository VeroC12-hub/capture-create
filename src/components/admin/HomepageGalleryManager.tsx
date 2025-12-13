import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhotoUploader } from "./PhotoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit2, Eye, EyeOff, Loader2, Link as LinkIcon, Copy } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type HomepagePhoto = Tables<"homepage_gallery">;

const CATEGORIES = [
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "event", label: "Event" },
  { value: "product", label: "Product" },
  { value: "corporate", label: "Corporate" },
  { value: "documentary", label: "Documentary" },
];

export const HomepageGalleryManager = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<HomepagePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingPhoto, setEditingPhoto] = useState<HomepagePhoto | null>(null);
  const [uploadCategory, setUploadCategory] = useState("wedding");

  const fetchPhotos = async () => {
    setIsLoading(true);
    let query = supabase
      .from("homepage_gallery")
      .select("*")
      .order("sort_order", { ascending: true });

    if (selectedCategory !== "all") {
      query = query.eq("category", selectedCategory);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching photos:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPhotos(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, [selectedCategory]);

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const togglePhotoActive = async (photo: HomepagePhoto) => {
    const { error } = await supabase
      .from("homepage_gallery")
      .update({ is_active: !photo.is_active })
      .eq("id", photo.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchPhotos();
    }
  };

  const deletePhoto = async (photo: HomepagePhoto) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    // Delete from storage
    await supabase.storage.from("photos").remove([photo.file_path]);

    // Delete from database
    const { error } = await supabase
      .from("homepage_gallery")
      .delete()
      .eq("id", photo.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Photo removed from gallery." });
      fetchPhotos();
    }
  };

  const updatePhoto = async (photo: HomepagePhoto) => {
    const { error } = await supabase
      .from("homepage_gallery")
      .update({
        caption: photo.caption,
        category: photo.category,
        sort_order: photo.sort_order,
      })
      .eq("id", photo.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Photo details saved." });
      setEditingPhoto(null);
      fetchPhotos();
    }
  };

  const copyUrl = (filePath: string) => {
    navigator.clipboard.writeText(getPublicUrl(filePath));
    toast({ title: "Copied", description: "Image URL copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-display text-xl mb-4">Upload to Homepage Gallery</h3>
        <div className="mb-4">
          <Label>Category</Label>
          <Select value={uploadCategory} onValueChange={setUploadCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <PhotoUploader
          category={uploadCategory}
          isHomepageGallery
          onUploadComplete={fetchPhotos}
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h3 className="font-display text-xl">Manage Homepage Photos</h3>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : photos.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No photos found. Upload some photos above.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`relative group rounded-lg overflow-hidden border ${
                  photo.is_active ? "border-primary" : "border-border opacity-60"
                }`}
              >
                <img
                  src={getPublicUrl(photo.file_path)}
                  alt={photo.caption || "Gallery photo"}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => togglePhotoActive(photo)}
                    title={photo.is_active ? "Hide" : "Show"}
                  >
                    {photo.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setEditingPhoto(photo)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => copyUrl(photo.file_path)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deletePhoto(photo)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-2">
                  <span className="text-xs text-background capitalize">
                    {photo.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Photo Details</DialogTitle>
          </DialogHeader>
          {editingPhoto && (
            <div className="space-y-4">
              <div>
                <Label>Caption</Label>
                <Input
                  value={editingPhoto.caption || ""}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, caption: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={editingPhoto.category}
                  onValueChange={(value) =>
                    setEditingPhoto({ ...editingPhoto, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={editingPhoto.sort_order || 0}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <Button onClick={() => updatePhoto(editingPhoto)} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
