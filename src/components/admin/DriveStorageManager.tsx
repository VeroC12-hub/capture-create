import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, FolderOpen, Cloud, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleDrivePicker } from "./GoogleDrivePicker";

interface UploadingFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  preview: string;
}

export const DriveStorageManager = () => {
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isImportingFromDrive, setIsImportingFromDrive] = useState(false);
  const [folderName, setFolderName] = useState("");
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { isConnected, uploadToDrive, getFileContent } = useGoogleDrive();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadingFile[] = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));
    setUploadingFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newFiles: UploadingFile[] = fileArray.map((file) => ({
        file,
        progress: 0,
        status: "pending" as const,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      }));
      setUploadingFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleGoogleDriveSelect = async (driveFiles: Array<{ id: string; name: string; mimeType: string }>) => {
    setIsImportingFromDrive(true);
    toast({
      title: "Importing from Google Drive",
      description: `Downloading ${driveFiles.length} file(s)...`,
    });

    const importedFiles: UploadingFile[] = [];

    for (const driveFile of driveFiles) {
      try {
        const blob = await getFileContent(driveFile.id);
        if (blob) {
          const file = new File([blob], driveFile.name, { type: driveFile.mimeType });
          importedFiles.push({
            file,
            progress: 0,
            status: "pending",
            preview: file.type.startsWith("image/") ? URL.createObjectURL(blob) : "",
          });
        }
      } catch (error) {
        console.error(`Failed to download ${driveFile.name}:`, error);
      }
    }

    setUploadingFiles((prev) => [...prev, ...importedFiles]);
    setIsImportingFromDrive(false);
    toast({
      title: "Import Complete",
      description: `${importedFiles.length} file(s) imported from Google Drive`,
    });
  };

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (uploadingFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    if (!folderName.trim()) {
      toast({
        title: "Folder Name Required",
        description: "Please enter a folder name for organization",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Google Drive Not Connected",
        description: "Please connect to Google Drive first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < uploadingFiles.length; i++) {
      const { file } = uploadingFiles[i];

      setUploadingFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading" as const, progress: 30 } : f
        )
      );

      try {
        await uploadToDrive(file, {
          category: folderName.trim(),
        });

        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "complete" as const, progress: 100 } : f
          )
        );
        successCount++;
      } catch (error: any) {
        console.error("Upload error:", error);
        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error" as const } : f
          )
        );
        errorCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast({
        title: "Upload Complete",
        description: `${successCount} file(s) uploaded to Google Drive${errorCount > 0 ? `. ${errorCount} failed.` : ""}`,
      });
    }

    if (errorCount === uploadingFiles.length) {
      toast({
        title: "Upload Failed",
        description: "All uploads failed. Please try again.",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setUploadingFiles((prev) => prev.filter((f) => f.status !== "complete"));
    }, 2000);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Storage</CardTitle>
          <CardDescription>Connect to Google Drive to use this feature</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please connect your Google Drive account from the settings to upload files directly to your Drive storage.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Google Drive Storage
          </CardTitle>
          <CardDescription>
            Upload files directly to your Google Drive for organization and storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Folder Name Input */}
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name *</Label>
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-muted-foreground" />
              <Input
                id="folderName"
                placeholder="e.g., Wedding Smith 2024, Product Shoot Dec, etc."
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                disabled={isUploading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Files will be uploaded to: Photography/{folderName}
            </p>
          </div>

          {/* Upload Area */}
          <div className="flex gap-2">
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-primary font-medium">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-foreground font-medium mb-1">Drag & drop files here</p>
                  <p className="text-muted-foreground text-sm">or click to select files</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => folderInputRef.current?.click()}
                className="h-auto flex-col py-4 px-6"
                disabled={isImportingFromDrive || isUploading}
              >
                <FolderOpen className="w-6 h-6 mb-2" />
                <span className="text-xs">Upload Folder</span>
              </Button>
              <input
                ref={folderInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFolderSelect}
                {...({ webkitdirectory: "", directory: "" } as any)}
              />

              <GoogleDrivePicker
                onSelect={handleGoogleDriveSelect}
                multiple={true}
                allowFolderSelection={true}
                trigger={
                  <Button
                    variant="outline"
                    className="h-auto flex-col py-4 px-6"
                    disabled={isImportingFromDrive || isUploading}
                  >
                    {isImportingFromDrive ? (
                      <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                    ) : (
                      <Cloud className="w-6 h-6 mb-2" />
                    )}
                    <span className="text-xs">From Drive</span>
                  </Button>
                }
              />
            </div>
          </div>

          {/* File Preview and Upload */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {uploadingFiles.length} file(s) selected
                </span>
                <Button onClick={uploadFiles} disabled={isUploading} className="bg-primary hover:bg-primary/90">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4 mr-2" />
                      Upload to Drive
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                {uploadingFiles.map((uf, index) => (
                  <div key={index} className="relative bg-card rounded-lg overflow-hidden border border-border">
                    {uf.preview ? (
                      <img src={uf.preview} alt={uf.file.name} className="w-full h-24 object-cover" />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-muted">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="text-xs text-center px-2 mt-2">{uf.file.name}</p>
                      </div>
                    )}
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
                        <Cloud className="w-6 h-6 text-primary" />
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
        </CardContent>
      </Card>
    </div>
  );
};
