/** Same rule as roster cards: private Vercel blob URLs are loaded via the avatar proxy route. */
export function resolvePlayerAvatarSrc(player: { id: string; avatarUrl?: string | null }) {
  if (!player.avatarUrl) return undefined;
  if (player.avatarUrl.includes(".private.blob.vercel-storage.com")) {
    return `/api/v1/players/${player.id}/avatar`;
  }
  return player.avatarUrl;
}
