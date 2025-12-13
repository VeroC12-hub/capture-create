import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { Cloud, CloudOff, Loader2 } from "lucide-react";

export const GoogleDriveConnect = () => {
  const { isConnected, isLoading, isConnecting, connect, disconnect } = useGoogleDrive();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isConnected ? (
            <Cloud className="w-5 h-5 text-green-500" />
          ) : (
            <CloudOff className="w-5 h-5 text-muted-foreground" />
          )}
          Google Drive
        </CardTitle>
        <CardDescription>
          {isConnected
            ? "Your Google Drive is connected. Uploads will be automatically organized."
            : "Connect to Google Drive to automatically sync your photos."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected
            </div>
            <p className="text-sm text-muted-foreground">
              Photos will be organized in: Photography / [Category] / [Client] / [Package]
            </p>
            <Button variant="outline" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={connect} disabled={isConnecting}>
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 mr-2" />
                Connect Google Drive
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};