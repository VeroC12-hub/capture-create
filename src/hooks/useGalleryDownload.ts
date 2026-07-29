import { useState } from "react";
import { downloadZip } from "client-zip";

export interface DownloadablePhoto {
  name: string;
  url: string;
}

interface Progress {
  done: number;
  total: number;
}

/**
 * Downloads a whole gallery as a ZIP at full resolution.
 *
 * Wedding galleries run to several GB, which is far too much to hold in memory
 * or to push through an edge function. So the archive is built in the browser
 * and, where the File System Access API exists (Chrome/Edge), streamed straight
 * to disk — memory stays flat regardless of gallery size. Browsers without it
 * (Firefox/Safari) fall back to buffering a Blob, which is fine for smaller
 * galleries but is why we warn above a threshold.
 */
const BLOB_FALLBACK_WARN_BYTES = 1.5 * 1024 * 1024 * 1024; // 1.5GB

export const useGalleryDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<Progress>({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const supportsStreamingSave =
    typeof window !== "undefined" && "showSaveFilePicker" in window;

  const download = async (photos: DownloadablePhoto[], zipName: string) => {
    if (!photos.length) return;

    setError(null);
    setIsDownloading(true);
    setProgress({ done: 0, total: photos.length });

    try {
      // Lazily fetch each photo as the zip writer pulls it, so only one file is
      // in flight at a time rather than all of them at once.
      let fetched = 0;
      async function* lazyFiles() {
        for (const photo of photos) {
          const response = await fetch(photo.url);
          if (!response.ok) {
            throw new Error(`Could not fetch ${photo.name} (${response.status})`);
          }
          yield { name: photo.name, input: response };
          fetched += 1;
          setProgress({ done: fetched, total: photos.length });
        }
      }

      const zipResponse = downloadZip(lazyFiles());

      if (supportsStreamingSave) {
        // @ts-expect-error showSaveFilePicker is not in the default DOM lib yet
        const handle = await window.showSaveFilePicker({
          suggestedName: zipName,
          types: [{ description: "ZIP archive", accept: { "application/zip": [".zip"] } }],
        });
        const writable = await handle.createWritable();
        await zipResponse.body!.pipeTo(writable);
      } else {
        const blob = await zipResponse.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = zipName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e: any) {
      // The user dismissing the save dialog is a cancel, not a failure.
      if (e?.name === "AbortError") return;
      console.error("Gallery download failed:", e);
      setError(e?.message || "Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    download,
    isDownloading,
    progress,
    error,
    supportsStreamingSave,
    blobFallbackWarnBytes: BLOB_FALLBACK_WARN_BYTES,
  };
};
