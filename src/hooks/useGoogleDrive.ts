import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

interface DriveFolder {
  id: string;
  name: string;
}

export const useGoogleDrive = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const checkConnection = useCallback(async () => {
    if (!session) {
      setIsConnected(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=status`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIsConnected(result.connected);
      }
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connect = async () => {
    if (!session) return;

    setIsConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/admin?google_callback=true`;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=auth-url&redirect_uri=${encodeURIComponent(redirectUri)}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const { url } = await response.json();
        // Store state for callback
        sessionStorage.setItem('google_drive_connecting', 'true');
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCallback = async (code: string) => {
    if (!session) return false;

    try {
      const redirectUri = `${window.location.origin}/admin?google_callback=true`;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=callback&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "Connected!",
          description: "Successfully connected to Google Drive",
        });
        return true;
      }
    } catch (error) {
      console.error('Error handling callback:', error);
      toast({
        title: "Connection Failed",
        description: "Could not complete Google Drive connection",
        variant: "destructive",
      });
    }
    return false;
  };

  const disconnect = async () => {
    if (!session) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=disconnect`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        setIsConnected(false);
        toast({
          title: "Disconnected",
          description: "Google Drive has been disconnected",
        });
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const listFolders = async (parentId?: string): Promise<DriveFolder[]> => {
    if (!session) return [];

    try {
      const url = parentId
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=list-folders&parent_id=${parentId}`
        : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=list-folders`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.files || [];
      }
    } catch (error) {
      console.error('Error listing folders:', error);
    }
    return [];
  };

  const listFiles = async (folderId?: string): Promise<DriveFile[]> => {
    if (!session) return [];

    try {
      const url = folderId
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=list-files&folder_id=${folderId}`
        : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=list-files`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.files || [];
      }
    } catch (error) {
      console.error('Error listing files:', error);
    }
    return [];
  };

  const uploadToDrive = async (
    file: File,
    options: {
      clientName?: string;
      packageType?: string;
      category?: string;
    }
  ): Promise<boolean> => {
    if (!session) return false;

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options.clientName) formData.append('client_name', options.clientName);
      if (options.packageType) formData.append('package_type', options.packageType);
      if (options.category) formData.append('category', options.category);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      return false;
    }
  };

  const getFileContent = async (fileId: string): Promise<Blob | null> => {
    if (!session) return null;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive?action=get-file&file_id=${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        return response.blob();
      }
    } catch (error) {
      console.error('Error getting file:', error);
    }
    return null;
  };

  return {
    isConnected,
    isLoading,
    isConnecting,
    connect,
    disconnect,
    handleCallback,
    listFolders,
    listFiles,
    uploadToDrive,
    getFileContent,
    checkConnection,
  };
};