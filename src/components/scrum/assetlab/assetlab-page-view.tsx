import { useState } from "react";
import { Upload, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type UploadFieldKey =
  | "backgroundPost"
  | "backgroundStory"
  | "defaultPlayerImage";

type LayoutState = Record<UploadFieldKey, string>;

type AssetLabPageViewProps = {
  layouts: LayoutState;
  isLoadingLayouts: boolean;
  isUploading: Record<UploadFieldKey, boolean>;
  onUploadFieldChange: (
    key: UploadFieldKey,
    file: File | null,
  ) => Promise<void>;
};

export function AssetLabPageView({
  layouts,
  isLoadingLayouts,
  isUploading,
  onUploadFieldChange,
}: AssetLabPageViewProps) {
  console.log("isLoadingLayouts", isLoadingLayouts);
  console.log("layouts", layouts);
  console.log("isUploading", isUploading);
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-variant/30 via-background to-background" />

      <main className="mx-auto min-h-screen max-w-[1440px] px-4 pb-12 md:px-page-padding">
        <div className="flex flex-col gap-8">
          <section className="border-b border-glass-border/30 pb-6">
            <h1 className="font-display-title text-display-title text-on-background">
              Asset Lab
            </h1>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Upload your layout images and review post/story previews
              instantly.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-6 xl:grid-cols-12">
            <Card className="border-glass-border/40 bg-surface md:col-span-3 xl:col-span-4">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-on-background">
                  <Upload className="h-4 w-4 text-primary" />
                  Post Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <UploadField
                  label="Background Post (16:9)"
                  isUploading={isUploading.backgroundPost}
                  onFileChange={(file) =>
                    onUploadFieldChange("backgroundPost", file)
                  }
                />
                <PreviewBlock
                  isLoadingLayouts={isLoadingLayouts}
                  image={layouts.backgroundPost}
                  wrapperClassName="aspect-video"
                />
              </CardContent>
            </Card>

            <Card className="border-glass-border/40 bg-surface md:col-span-3 xl:col-span-4">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-on-background">
                  <Upload className="h-4 w-4 text-primary" />
                  Story Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <UploadField
                  label="Background Story (9:16)"
                  isUploading={isUploading.backgroundStory}
                  onFileChange={(file) =>
                    onUploadFieldChange("backgroundStory", file)
                  }
                />
                <PreviewBlock
                  isLoadingLayouts={isLoadingLayouts}
                  image={layouts.backgroundStory}
                  wrapperClassName="mx-auto aspect-[9/16] w-56"
                />
              </CardContent>
            </Card>

            <Card className="border-glass-border/40 bg-surface md:col-span-6 xl:col-span-4">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-on-background">
                  <UserRound className="h-4 w-4 text-primary" />
                  Default Player Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <UploadField
                  label="Player Image"
                  isUploading={isUploading.defaultPlayerImage}
                  onFileChange={(file) =>
                    onUploadFieldChange("defaultPlayerImage", file)
                  }
                />
                <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border border-glass-border/50 bg-black/30">
                  {isLoadingLayouts ? (
                    <div className="h-full w-full animate-pulse bg-white/10" />
                  ) : layouts.defaultPlayerImage ? (
                    <img
                      src={layouts.defaultPlayerImage}
                      alt="Default player"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-white/5" />
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}

function UploadField({
  label,
  isUploading,
  onFileChange,
}: {
  label: string;
  isUploading: boolean;
  onFileChange: (file: File | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <Input
        type="file"
        accept="image/*"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        className="border-glass-border/50"
      />
      <p className="text-[11px] text-muted-foreground">
        {isUploading ? "Uploading to blob..." : "Ready"}
      </p>
    </div>
  );
}

function PreviewBlock({
  isLoadingLayouts,
  image,
  wrapperClassName,
}: {
  isLoadingLayouts: boolean;
  image: string;
  wrapperClassName: string;
}) {
  const [loadedImageSrc, setLoadedImageSrc] = useState("");
  const isImageLoaded = loadedImageSrc === image && image.length > 0;

  return (
    <div className="space-y-2">
      <div
        className={`relative overflow-hidden rounded-xl border border-glass-border/40 bg-black/40 ${wrapperClassName}`}
      >
        {isLoadingLayouts || (image && !isImageLoaded) ? (
          <div className="absolute inset-0 animate-pulse bg-white/10" />
        ) : null}

        {image ? (
          <img
            src={image}
            alt=""
            onLoad={() => setLoadedImageSrc(image)}
            onError={() => setLoadedImageSrc("")}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : !isLoadingLayouts ? (
          <div className="absolute inset-0 bg-white/5" />
        ) : null}
      </div>
    </div>
  );
}
