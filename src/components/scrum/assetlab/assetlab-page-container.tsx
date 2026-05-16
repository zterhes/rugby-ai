"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AssetLabPageView } from "@/components/scrum/assetlab/assetlab-page-view";

type UploadFieldKey =
  | "backgroundPost"
  | "backgroundStory"
  | "defaultPlayerImage";

type LayoutState = Record<UploadFieldKey, string>;

const FIELD_TO_SLOT: Record<UploadFieldKey, "post" | "story" | "default_player"> = {
  backgroundPost: "post",
  backgroundStory: "story",
  defaultPlayerImage: "default_player",
};

const DEFAULT_LAYOUTS: LayoutState = {
  backgroundPost: "",
  backgroundStory: "",
  defaultPlayerImage: "",
};

export function AssetLabPageContainer() {
  const [layouts, setLayouts] = useState<LayoutState>(DEFAULT_LAYOUTS);
  const [isLoadingLayouts, setIsLoadingLayouts] = useState(true);
  const [isUploading, setIsUploading] = useState<
    Record<UploadFieldKey, boolean>
  >({
    backgroundPost: false,
    backgroundStory: false,
    defaultPlayerImage: false,
  });

  const uploadedBlobUrlsRef = useRef<Partial<Record<UploadFieldKey, string>>>(
    {},
  );

  useEffect(() => {
    return () => {
      for (const value of Object.values(uploadedBlobUrlsRef.current)) {
        if (value && value.startsWith("blob:")) {
          URL.revokeObjectURL(value);
        }
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const response = await fetch("/api/v1/assetlab/layouts", {
          method: "GET",
        });
        if (!response.ok) return;

        const payload = (await response.json()) as {
          data: {
            backgroundPost?: string;
            backgroundStory?: string;
            defaultPlayerImage?: string;
          };
        };

        if (!isMounted) return;
        setLayouts({
          backgroundPost: payload.data.backgroundPost ?? "",
          backgroundStory: payload.data.backgroundStory ?? "",
          defaultPlayerImage: payload.data.defaultPlayerImage ?? "",
        });
      } catch {
        // Keep empty state when no previous uploads are available.
      } finally {
        if (isMounted) {
          setIsLoadingLayouts(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUploadFieldChange = async (
    key: UploadFieldKey,
    file: File | null,
  ) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const previousUrl = uploadedBlobUrlsRef.current[key];

    if (previousUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previousUrl);
    }

    uploadedBlobUrlsRef.current = {
      ...uploadedBlobUrlsRef.current,
      [key]: previewUrl,
    };

    setLayouts((previous) => ({ ...previous, [key]: previewUrl }));
    setIsUploading((previous) => ({ ...previous, [key]: true }));

    try {
      const formData = new FormData();
      formData.set("field", key);
      formData.set("file", file);

      const response = await fetch("/api/v1/assetlab/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Upload failed");
      }

      const slot = FIELD_TO_SLOT[key];
      setLayouts((previous) => ({
        ...previous,
        [key]: `/api/v1/assetlab/image?slot=${slot}&t=${Date.now()}`,
      }));
      toast.success(
        key === "defaultPlayerImage"
          ? "Default player image uploaded."
          : "Layout uploaded.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not upload image.";
      toast.error(message);
    } finally {
      setIsUploading((previous) => ({ ...previous, [key]: false }));
    }
  };

  return (
    <AssetLabPageView
      layouts={layouts}
      isLoadingLayouts={isLoadingLayouts}
      isUploading={isUploading}
      onUploadFieldChange={handleUploadFieldChange}
    />
  );
}
