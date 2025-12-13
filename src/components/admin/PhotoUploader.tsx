import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PhotoUploaderProps {
  galleryId?: string;
  category?: string;
  onUploadComplete: () => void;
  isHomepageGallery?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  preview: string;
}

export const PhotoUploader = ({
  galleryId,
  category = "general",
  onUploadComplete,
  isHomepageGallery = false,
}: PhotoUploaderProps) => {
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadingFile[] = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
      preview: URL.createObjectURL(file),
    }));
    setUploadingFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (uploadingFiles.length === 0) return;
    setIsUploading(true);

    for (let i = 0; i < uploadingFiles.length; i++) {
      const { file } = uploadingFiles[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = isHomepageGallery
        ? `homepage/${category}/${fileName}`
        : `galleries/${galleryId}/${fileName}`;

      setUploadingFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading" as const, progress: 30 } : f
        )
      );

      try {
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        setUploadingFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, progress: 70 } : f))
        );

        // Save to database
        if (isHomepageGallery) {
          const { error: dbError } = await supabase
            .from("homepage_gallery")
            .insert({
              file_path: filePath,
              category,
              caption: file.name.replace(/\.[^/.]+$/, ""),
            });
          if (dbError) throw dbError;
        } else if (galleryId) {
          const { error: dbError } = await supabase
            .from("gallery_photos")
            .insert({
              gallery_id: galleryId,
              file_path: filePath,
              file_name: file.name,
            });
          if (dbError) throw dbError;
        }

        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "complete" as const, progress: 100 } : f
          )
        );
      } catch (error: any) {
        console.error("Upload error:", error);
        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error" as const } : f
          )
        );
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    setIsUploading(false);
    toast({
      title: "Upload Complete",
      description: `${uploadingFiles.length} photo(s) uploaded successfully.`,
    });
    onUploadComplete();
    
    // Clear completed files after a delay
    setTimeout(() => {
      setUploadingFiles((prev) => prev.filter((f) => f.status !== "complete"));
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-primary font-medium">Drop photos here...</p>
        ) : (
          <div>
            <p className="text-foreground font-medium mb-1">
              Drag & drop photos here
            </p>
            <p className="text-muted-foreground text-sm">
              or click to select files
            </p>
          </div>
        )}
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {uploadingFiles.length} file(s) selected
            </span>
            <Button
              onClick={uploadFiles}
              disabled={isUploading}
              className="bg-primary hover:bg-primary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload All
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            {uploadingFiles.map((uf, index) => (
              <div
                key={index}
                className="relative bg-card rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={uf.preview}
                  alt={uf.file.name}
                  className="w-full h-24 object-cover"
                />
                {uf.status === "pending" && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {uf.status === "uploading" && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
                {uf.status === "complete" && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-primary" />
                  </div>
                )}
                {uf.status !== "pending" && (
                  <Progress value={uf.progress} className="absolute bottom-0 left-0 right-0 h-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
