import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { Folder, Image, ArrowLeft, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
}

interface DriveFolder {
  id: string;
  name: string;
}

interface GoogleDrivePickerProps {
  onSelect: (files: DriveFile[]) => void;
  multiple?: boolean;
  trigger?: React.ReactNode;
}

export const GoogleDrivePicker = ({ onSelect, multiple = true, trigger }: GoogleDrivePickerProps) => {
  const { isConnected, listFolders, listFiles } = useGoogleDrive();
  const [isOpen, setIsOpen] = useState(false);
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | undefined>();
  const [folderStack, setFolderStack] = useState<{ id?: string; name: string }[]>([{ name: "My Drive" }]);
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadContent = async (folderId?: string) => {
    setIsLoading(true);
    try {
      const [folderResult, fileResult] = await Promise.all([
        listFolders(folderId),
        listFiles(folderId),
      ]);
      setFolders(folderResult);
      setFiles(fileResult);
    } catch (error) {
      console.error("Error loading drive content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isConnected) {
      loadContent(currentFolder);
    }
  }, [isOpen, currentFolder, isConnected]);

  const navigateToFolder = (folder: DriveFolder) => {
    setFolderStack([...folderStack, { id: folder.id, name: folder.name }]);
    setCurrentFolder(folder.id);
  };

  const navigateBack = () => {
    if (folderStack.length > 1) {
      const newStack = folderStack.slice(0, -1);
      setFolderStack(newStack);
      setCurrentFolder(newStack[newStack.length - 1].id);
    }
  };

  const toggleFileSelection = (file: DriveFile) => {
    if (multiple) {
      const isSelected = selectedFiles.some((f) => f.id === file.id);
      if (isSelected) {
        setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
      } else {
        setSelectedFiles([...selectedFiles, file]);
      }
    } else {
      setSelectedFiles([file]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedFiles);
    setIsOpen(false);
    setSelectedFiles([]);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Pick from Google Drive</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Photos from Google Drive</DialogTitle>
        </DialogHeader>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {folderStack.map((folder, index) => (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && <span>/</span>}
              <span className={index === folderStack.length - 1 ? "font-medium text-foreground" : ""}>
                {folder.name}
              </span>
            </span>
          ))}
        </div>

        {/* Navigation */}
        {folderStack.length > 1 && (
          <Button variant="ghost" size="sm" onClick={navigateBack} className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        {/* Content */}
        <ScrollArea className="h-[400px] border rounded-lg p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Folders */}
              {folders.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Folders</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => navigateToFolder(folder)}
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                      >
                        <Folder className="w-5 h-5 text-primary" />
                        <span className="text-sm truncate">{folder.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Images</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {files.map((file) => {
                      const isSelected = selectedFiles.some((f) => f.id === file.id);
                      return (
                        <button
                          key={file.id}
                          onClick={() => toggleFileSelection(file)}
                          className={cn(
                            "relative aspect-square rounded-lg border overflow-hidden transition-all",
                            isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                          )}
                        >
                          {file.thumbnailLink ? (
                            <img
                              src={file.thumbnailLink}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Image className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {folders.length === 0 && files.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Image className="w-12 h-12 mb-4" />
                  <p>No folders or images found</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {selectedFiles.length} file(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={selectedFiles.length === 0}>
              Select Files
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};