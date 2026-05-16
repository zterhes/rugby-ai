import { put } from "@vercel/blob";
import { badRequest, internalError, ok } from "@/lib/api/http";

const FIELD_TO_SLOT = {
  backgroundPost: "post",
  backgroundStory: "story",
  defaultPlayerImage: "default_player",
} as const;

type UploadField = keyof typeof FIELD_TO_SLOT;

const ALLOWED_FIELDS = new Set<UploadField>(Object.keys(FIELD_TO_SLOT) as UploadField[]);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const field = String(formData.get("field") ?? "") as UploadField;
    const file = formData.get("file");

    if (!ALLOWED_FIELDS.has(field)) {
      return badRequest("Invalid upload field.");
    }

    if (!(file instanceof File) || !file.name || file.size === 0) {
      return badRequest("Valid image file is required.");
    }

    const slot = FIELD_TO_SLOT[field];
    const pathname = `assets/layouts/${slot}/current`;

    const blob = await put(pathname, file, {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });

    return ok({
      url: blob.downloadUrl ?? blob.url,
      pathname: blob.pathname,
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error("[API] POST /api/v1/assetlab/upload failed", error);
    return internalError("Could not upload image.");
  }
}
