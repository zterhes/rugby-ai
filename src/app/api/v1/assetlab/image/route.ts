import { get } from "@vercel/blob";
import { badRequest, internalError, notFound } from "@/lib/api/http";

const SLOT_TO_PATH = {
  post: "assets/layouts/post/current",
  story: "assets/layouts/story/current",
  default_player: "assets/layouts/default_player/current",
} as const;

type Slot = keyof typeof SLOT_TO_PATH;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slot = url.searchParams.get("slot") as Slot | null;

    if (!slot || !(slot in SLOT_TO_PATH)) {
      return badRequest("Invalid or missing slot.");
    }

    const { stream, headers } = await get(SLOT_TO_PATH[slot], {
      access: "private",
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "content-type": headers.get("content-type") ?? "application/octet-stream",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      return notFound("Image not found.");
    }

    console.error("[API] GET /api/v1/assetlab/image failed", error);
    return internalError("Could not fetch image.");
  }
}
