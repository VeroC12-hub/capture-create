import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSiteImages } from "@/hooks/useSiteImages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Image, Loader2, RotateCcw, Plus, Trash2, Search, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Page-based categories for better organization
const PAGE_CATEGORIES = {
  "home": {
    label: "Home Page",
    description: "Images displayed on the homepage",
    subcategories: ["hero", "gallery", "services"]
  },
  "services": {
    label: "Services Page",
    description: "Service category images and galleries",
    subcategories: ["services", "wedding-gallery", "event-gallery", "professional-gallery"]
  },
  "portfolio": {
    label: "Portfolio Page",
    description: "Portfolio gallery images",
    subcategories: ["portfolio"]
  },
  "about": {
    label: "About Page",
    description: "About page images",
    subcategories: ["about"]
  },
  "contact": {
    label: "Contact Page",
    description: "Contact page images",
    subcategories: ["contact"]
  },
  "footer": {
    label: "Footer",
    description: "Footer banner images",
    subcategories: ["footer"]
  },
  "other": {
    label: "Other",
    description: "Uncategorized images",
    subcategories: ["portrait-gallery", "product-gallery", "general"]
  }
};

const SiteImagesManager = () => {
  const { images, isLoading, getPublicUrl, updateImage, clearImage, refetch, fallbackImages } = useSiteImages();
  const { toast } = useToast();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState({
    imageKey: "",
    imageName: "",
    category: "general",
    description: "",
  });

  const handleUpload = async (imageKey: string, file: File) => {
    setUploadingKey(imageKey);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `site-images/${imageKey}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Update database
      const { error: updateError } = await updateImage(imageKey, filePath);
      if (updateError) throw updateError;

      toast({
        title: "Image Updated",
        description: "The image has been replaced successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleBulkUpload = async (files: File[]) => {
    toast({
      title: "Bulk Upload Started",
      description: `Uploading ${files.length} images...`,
    });

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        // Extract image key from filename (remove extension)
        const imageKey = file.name.replace(/\.[^/.]+$/, "");

        // Check if image slot exists
        const existingImage = images.find(img => img.image_key === imageKey);

        if (existingImage) {
          await handleUpload(imageKey, file);
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    toast({
      title: "Bulk Upload Complete",
      description: `${successCount} uploaded, ${failCount} failed. Failed uploads need image slots created first.`,
    });

    setIsBulkUploadOpen(false);
  };

  const handleAddImageSlot = async () => {
    if (!newImage.imageKey || !newImage.imageName) {
      toast({
        title: "Missing Information",
        description: "Please provide both image key and name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("site_images")
        .insert({
          image_key: newImage.imageKey,
          image_name: newImage.imageName,
          category: newImage.category,
          description: newImage.description || null,
        });

      if (error) throw error;

      toast({
        title: "Image Slot Created",
        description: "You can now upload an image to this slot.",
      });

      setIsAddDialogOpen(false);
      setNewImage({
        imageKey: "",
        imageName: "",
        category: "general",
        description: "",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteImageSlot = async (imageId: string, imageKey: string) => {
    if (!confirm("Are you sure you want to delete this image slot? This cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("site_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Image Slot Deleted",
        description: "The image slot has been removed.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClear = async (imageKey: string) => {
    const { error } = await clearImage(imageKey);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to reset image.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Image Reset",
        description: "Image has been reset to default.",
      });
    }
  };

  // Filter images by page and search query
  const filteredImages = images.filter(img => {
    const matchesSearch = img.image_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         img.image_key.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedPage === "all") return matchesSearch;

    const pageConfig = PAGE_CATEGORIES[selectedPage as keyof typeof PAGE_CATEGORIES];
    const matchesPage = pageConfig?.subcategories.includes(img.category);

    return matchesSearch && matchesPage;
  });

  // Group filtered images by category
  const groupedImages = filteredImages.reduce((acc, img) => {
    if (!acc[img.category]) {
      acc[img.category] = [];
    }
    acc[img.category].push(img);
    return acc;
  }, {} as Record<string, typeof images>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Site Images</h2>
          <p className="text-muted-foreground">
            Manage all images across your website. Upload, replace, or remove images as needed.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Image Slot
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            {Object.entries(PAGE_CATEGORIES).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <Alert>
        <AlertDescription>
          <strong>{filteredImages.length}</strong> image slots {selectedPage !== "all" && `on ${PAGE_CATEGORIES[selectedPage as keyof typeof PAGE_CATEGORIES]?.label}`}
          {" • "}
          <strong>{filteredImages.filter(img => img.file_path).length}</strong> custom images uploaded
          {" • "}
          <strong>{filteredImages.filter(img => !img.file_path).length}</strong> using defaults
        </AlertDescription>
      </Alert>

      {/* Image Grids by Category */}
      {Object.entries(groupedImages).map(([category, categoryImages]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
            {category.replace(/-/g, " ")}
            <Badge variant="secondary">{categoryImages.length}</Badge>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                currentUrl={
                  image.file_path
                    ? getPublicUrl(image.file_path)
                    : fallbackImages[image.image_key]
                }
                hasCustomImage={!!image.file_path}
                isUploading={uploadingKey === image.image_key}
                onUpload={(file) => handleUpload(image.image_key, file)}
                onClear={() => handleClear(image.image_key)}
                onDelete={() => handleDeleteImageSlot(image.id, image.image_key)}
                onPreview={() => setPreviewImage(
                  image.file_path ? getPublicUrl(image.file_path) : fallbackImages[image.image_key]
                )}
              />
            ))}
          </div>
        </div>
      ))}

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No images found matching your search.</p>
        </div>
      )}

      {/* Add Image Slot Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Image Slot</DialogTitle>
            <DialogDescription>
              Create a new placeholder for an image. You can upload the actual image after creating the slot.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageKey">Image Key (unique ID)*</Label>
              <Input
                id="imageKey"
                placeholder="e.g., wedding-gallery-7"
                value={newImage.imageKey}
                onChange={(e) => setNewImage({ ...newImage, imageKey: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use lowercase with hyphens. This will be used in code to reference the image.
              </p>
            </div>
            <div>
              <Label htmlFor="imageName">Display Name*</Label>
              <Input
                id="imageName"
                placeholder="e.g., Wedding Gallery 7"
                value={newImage.imageName}
                onChange={(e) => setNewImage({ ...newImage, imageName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={newImage.category} onValueChange={(value) => setNewImage({ ...newImage, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="wedding-gallery">Wedding Gallery</SelectItem>
                  <SelectItem value="portrait-gallery">Portrait Gallery</SelectItem>
                  <SelectItem value="event-gallery">Event Gallery</SelectItem>
                  <SelectItem value="professional-gallery">Professional Gallery</SelectItem>
                  <SelectItem value="product-gallery">Product Gallery</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Where this image appears..."
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddImageSlot}>Create Image Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUpload={handleBulkUpload}
      />

      {/* Image Preview Dialog */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            <img src={previewImage} alt="Preview" className="w-full h-auto rounded-lg" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface ImageCardProps {
  image: {
    id: string;
    image_key: string;
    image_name: string;
    description: string | null;
  };
  currentUrl: string;
  hasCustomImage: boolean;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
  onDelete: () => void;
  onPreview: () => void;
}

const ImageCard = ({
  image,
  currentUrl,
  hasCustomImage,
  isUploading,
  onUpload,
  onClear,
  onDelete,
  onPreview,
}: ImageCardProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">{image.image_name}</CardTitle>
          <div className="flex items-center gap-1">
            {hasCustomImage && (
              <Badge variant="secondary" className="text-xs">
                Custom
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">{image.image_key}</p>
        {image.description && (
          <p className="text-xs text-muted-foreground">{image.description}</p>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <div className="relative aspect-video rounded-md overflow-hidden bg-muted group">
          {currentUrl ? (
            <>
              <img
                src={currentUrl}
                alt={image.image_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary" onClick={onPreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-3 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {isDragActive ? "Drop image here" : "Click or drag to replace"}
          </p>
        </div>

        <div className="flex gap-2">
          {hasCustomImage && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onClear}
              disabled={isUploading}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={onDelete}
            disabled={isUploading}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BulkUploadDialog = ({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
      onClose();
    },
    [onUpload, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Images</DialogTitle>
          <DialogDescription>
            Upload multiple images at once. Files will be matched to existing image slots by filename (without extension).
          </DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? "Drop images here" : "Drag & drop images here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select multiple files
          </p>
        </div>
        <Alert>
          <AlertDescription className="text-xs">
            <strong>Note:</strong> Images must match existing image slot keys. For example, "wedding-gallery-7.jpg" will update the "wedding-gallery-7" slot. Create image slots first if needed.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

export default SiteImagesManager;
