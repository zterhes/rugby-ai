import { put } from "@vercel/blob";
import { env } from "@/env";

export const uploadMatchAsset = async (
  imagePath: string,
  buffer: Buffer,
  contentType = "image/png"
) => {
  const blob = await put(imagePath, buffer, {
    access: "public",
    contentType,
    token: env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
  });

  return {
    imageUrl: blob.url,
    imagePath: blob.pathname,
  };
};
