import { get, put } from "@vercel/blob";
import { badRequest, internalError, notFound, ok } from "@/lib/api/http";
import { getPlayerById, setPlayerAvatar } from "@/lib/repositories/players.repository";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const player = await getPlayerById(id);
    if (!player) return notFound(`Player not found for id: ${id}`);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) return badRequest("Missing file upload.");
    if (!file.type.startsWith("image/")) {
      return badRequest("Invalid file type. Only images are allowed.");
    }
    if (file.size === 0) return badRequest("Cannot upload an empty file.");
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return badRequest("File too large. Max allowed size is 5MB.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const pathname = `player-avatars/${id}.${extension}`;
    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const updated = await setPlayerAvatar(id, blob.url);
    if (!updated) return notFound(`Player not found for id: ${id}`);

    return ok({ url: updated.avatarUrl });
  } catch (error) {
    console.error("[API] POST /api/v1/players/[id]/avatar failed", error);
    const message =
      error instanceof Error ? `Could not upload avatar: ${error.message}` : "Could not upload avatar.";
    return internalError(message);
  }
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const player = await getPlayerById(id);
    if (!player) return notFound(`Player not found for id: ${id}`);
    if (!player.avatarUrl) return notFound("Player has no avatar.");

    const blobResult = await get(player.avatarUrl, { access: "private" });
    if (!blobResult || !blobResult.stream) return notFound("Avatar blob not found.");

    return new Response(blobResult.stream, {
      status: 200,
      headers: {
        "content-type": blobResult.blob.contentType ?? "application/octet-stream",
        "cache-control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("[API] GET /api/v1/players/[id]/avatar failed", error);
    return internalError("Could not load avatar.");
  }
}
