import { put } from "@vercel/blob";
import { serverEnv } from "@/env";

export const uploadMatchAsset = async (
  imagePath: string,
  buffer: Buffer,
  contentType = "image/png",
) => {
  const blob = await put(imagePath, buffer, {
    access: "private",
    contentType,
    token: serverEnv.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
  });

  return {
    imageUrl: blob.url,
    imagePath: blob.pathname,
  };
};

export const uploadPlayerAvatar = async (
  file: File,
  fileName: string,
  extension: string,
) => {
  const blob = await put(`player-avatars/${fileName}.${extension}`, file, {
    access: "private",
    addRandomSuffix: true,
    token: serverEnv.BLOB_READ_WRITE_TOKEN,
  });

  return { url: blob.url };
};
