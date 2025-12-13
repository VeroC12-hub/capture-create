import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhotoUploader } from "./PhotoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Link as LinkIcon,
  Copy,
  Loader2,
  Calendar,
  Lock,
  Unlock,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Gallery = Tables<"client_galleries">;
type GalleryPhoto = Tables<"gallery_photos">;

export const ClientGalleryManager = () => {
  const { toast } = useToast();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<Record<string, GalleryPhoto[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [newGallery, setNewGallery] = useState({
    title: "",
    description: "",
    event_date: "",
    password: "",
    is_public: false,
  });

  const fetchGalleries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("client_galleries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching galleries:", error);
    } else {
      setGalleries(data || []);
    }
    setIsLoading(false);
  };

  const fetchGalleryPhotos = async (galleryId: string) => {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("gallery_id", galleryId)
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setGalleryPhotos((prev) => ({ ...prev, [galleryId]: data }));
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const createGallery = async () => {
    const { error } = await supabase.from("client_galleries").insert({
      title: newGallery.title,
      description: newGallery.description || null,
      event_date: newGallery.event_date || null,
      password: newGallery.password || null,
      is_public: newGallery.is_public,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Created", description: "Gallery created successfully." });
      setIsCreateOpen(false);
      setNewGallery({ title: "", description: "", event_date: "", password: "", is_public: false });
      fetchGalleries();
    }
  };

  const updateGallery = async (gallery: Gallery) => {
    const { error } = await supabase
      .from("client_galleries")
      .update({
        title: gallery.title,
        description: gallery.description,
        event_date: gallery.event_date,
        password: gallery.password,
        is_public: gallery.is_public,
      })
      .eq("id", gallery.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Gallery updated." });
      setEditingGallery(null);
      fetchGalleries();
    }
  };

  const deleteGallery = async (gallery: Gallery) => {
    if (!confirm(`Delete gallery "${gallery.title}"? This will also delete all photos.`)) return;

    // Delete photos from storage first
    const photos = galleryPhotos[gallery.id] || [];
    if (photos.length > 0) {
      await supabase.storage
        .from("photos")
        .remove(photos.map((p) => p.file_path));
    }

    const { error } = await supabase
      .from("client_galleries")
      .delete()
      .eq("id", gallery.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Gallery and all photos removed." });
      fetchGalleries();
    }
  };

  const deletePhoto = async (photo: GalleryPhoto) => {
    await supabase.storage.from("photos").remove([photo.file_path]);
    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", photo.id);

    if (!error) {
      fetchGalleryPhotos(photo.gallery_id);
    }
  };

  const copyGalleryLink = (gallery: Gallery) => {
    const link = `${window.location.origin}/gallery/${gallery.id}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Copied", description: "Gallery link copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl">Client Galleries</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Gallery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Gallery Title *</Label>
                <Input
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  placeholder="e.g., John & Sarah Wedding"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={newGallery.event_date}
                  onChange={(e) => setNewGallery({ ...newGallery, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Password Protection</Label>
                <Input
                  type="text"
                  value={newGallery.password}
                  onChange={(e) => setNewGallery({ ...newGallery, password: e.target.value })}
                  placeholder="Leave empty for no password"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={newGallery.is_public}
                  onCheckedChange={(checked) => setNewGallery({ ...newGallery, is_public: checked })}
                />
                <Label>Make gallery public (visible without login)</Label>
              </div>
              <Button onClick={createGallery} disabled={!newGallery.title} className="w-full">
                Create Gallery
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : galleries.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No galleries yet. Create your first one!</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {galleries.map((gallery) => (
            <AccordionItem
              key={gallery.id}
              value={gallery.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                className="px-6 py-4 hover:no-underline"
                onClick={() => fetchGalleryPhotos(gallery.id)}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="flex-1">
                    <h4 className="font-display text-lg">{gallery.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      {gallery.event_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(gallery.event_date).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        {gallery.password ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        {gallery.password ? "Protected" : "No password"}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button size="sm" variant="outline" onClick={() => copyGalleryLink(gallery)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingGallery(gallery)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteGallery(gallery)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium mb-3">Upload Photos</h5>
                  <PhotoUploader
                    galleryId={gallery.id}
                    onUploadComplete={() => fetchGalleryPhotos(gallery.id)}
                  />
                </div>

                {galleryPhotos[gallery.id] && galleryPhotos[gallery.id].length > 0 && (
                  <div>
                    <h5 className="font-medium mb-3">
                      Photos ({galleryPhotos[gallery.id].length})
                    </h5>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                      {galleryPhotos[gallery.id].map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={getPublicUrl(photo.file_path)}
                            alt={photo.file_name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            onClick={() => deletePhoto(photo)}
                            className="absolute inset-0 bg-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
                          >
                            <Trash2 className="w-4 h-4 text-destructive-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Edit Gallery Dialog */}
      <Dialog open={!!editingGallery} onOpenChange={() => setEditingGallery(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gallery</DialogTitle>
          </DialogHeader>
          {editingGallery && (
            <div className="space-y-4">
              <div>
                <Label>Gallery Title</Label>
                <Input
                  value={editingGallery.title}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingGallery.description || ""}
                  onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={editingGallery.event_date || ""}
                  onChange={(e) => setEditingGallery({ ...editingGallery, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  value={editingGallery.password || ""}
                  onChange={(e) => setEditingGallery({ ...editingGallery, password: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingGallery.is_public || false}
                  onCheckedChange={(checked) => setEditingGallery({ ...editingGallery, is_public: checked })}
                />
                <Label>Public gallery</Label>
              </div>
              <Button onClick={() => updateGallery(editingGallery)} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
