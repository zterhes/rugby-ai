"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownload } from "@/hooks/useDownload";

interface ImageViewerProps {
  src: string;
  alt: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  fullWidth?: number;
  fullHeight?: number;
}

export const ImageViewer = ({
  src,
  alt,
  thumbnailWidth = 100,
  thumbnailHeight = 100,
  fullWidth = 800,
  fullHeight = 800,
}: ImageViewerProps) => {
  const { download } = useDownload(src);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={src}
          alt={alt}
          width={thumbnailWidth}
          height={thumbnailHeight}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={fullWidth}
            height={fullHeight}
            className="w-full h-auto"
          />
          <Button
            onClick={download}
            className="absolute top-4 right-4"
            size="sm"
          >
            <DownloadIcon className="size-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
