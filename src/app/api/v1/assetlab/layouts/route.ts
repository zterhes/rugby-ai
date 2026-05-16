import { list } from "@vercel/blob";
import { internalError, ok } from "@/lib/api/http";

export async function GET() {
  try {
    const [hasPost, hasStory, hasPlayer] = await Promise.all([
      hasCurrentSlot("post"),
      hasCurrentSlot("story"),
      hasCurrentSlot("default_player"),
    ]);

    return ok({
      backgroundPost: hasPost ? buildImageProxyUrl("post") : "",
      backgroundStory: hasStory ? buildImageProxyUrl("story") : "",
      defaultPlayerImage: hasPlayer ? buildImageProxyUrl("default_player") : "",
    });
  } catch (error) {
    console.error("[API] GET /api/v1/assetlab/layouts failed", error);
    return internalError("Could not load current layouts.");
  }
}

async function hasCurrentSlot(slot: "post" | "story" | "default_player") {
  const result = await list({
    prefix: `assets/layouts/${slot}/current`,
    limit: 1,
  });
  return Boolean(result.blobs[0]);
}

function buildImageProxyUrl(slot: "post" | "story" | "default_player") {
  return `/api/v1/assetlab/image?slot=${slot}`;
}
