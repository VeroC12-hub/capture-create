import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSiteImages } from "@/hooks/useSiteImages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, Loader2, RotateCcw } from "lucide-react";

const SiteImagesManager = () => {
  const { images, isLoading, getPublicUrl, updateImage, clearImage, fallbackImages } = useSiteImages();
  const { toast } = useToast();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const categories = [...new Set(images.map((img) => img.category))];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Site Images</h2>
        <p className="text-muted-foreground">
          Upload your own images to replace the default ones across the website.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">
            {category.replace(/-/g, " ")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images
              .filter((img) => img.category === category)
              .map((image) => (
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
                />
              ))}
          </div>
        </div>
      ))}
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
}

const ImageCard = ({
  image,
  currentUrl,
  hasCustomImage,
  isUploading,
  onUpload,
  onClear,
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
    <Card className="overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{image.image_name}</CardTitle>
          {hasCustomImage && (
            <Badge variant="secondary" className="text-xs">
              Custom
            </Badge>
          )}
        </div>
        {image.description && (
          <p className="text-xs text-muted-foreground">{image.description}</p>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={image.image_name}
              className="w-full h-full object-cover"
            />
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

        {hasCustomImage && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onClear}
            disabled={isUploading}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset to Default
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SiteImagesManager;
