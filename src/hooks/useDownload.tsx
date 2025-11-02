import { useCallback } from "react";

interface UseDownloadOptions {
  filename?: string;
}

export const useDownload = (src: string, options?: UseDownloadOptions) => {
  const download = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = options?.filename || `roster-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("download failed:", error);
    }
  }, [src, options?.filename]);

  return { download };
};
