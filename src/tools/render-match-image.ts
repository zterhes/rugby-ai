import { tool } from "ai";
import { createCanvas, loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import { nanoid } from "nanoid";
import { RENDER_MATCH_IMAGE_TOOL_PROMPT } from "@/lib/promts/tool-promts";
import {
  Player,
  renderMatchImageInputSchema,
  renderMatchImageOutputSchema,
  MatchFlow,
  RenderMatchImageInput,
} from "@/lib/schemas";
import { MATCH_TEMPLATE_CONFIG } from "@/lib/match-image-templates";
import { uploadMatchAsset } from "@/tools/clients/blob.client";

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
};

const makeImagePath = (flow: MatchFlow) => {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `match-assets/${flow}/${yyyy}/${mm}/${dd}/${nanoid()}.png`;
};

const fillBackground = (
  ctx: SKRSContext2D,
  width: number,
  height: number,
  primaryColor?: string,
  secondaryColor?: string
) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, primaryColor || "#0b1024");
  gradient.addColorStop(1, secondaryColor || "#1f3a8a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.15, Math.min(width, height) * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.78, Math.min(width, height) * 0.25, 0, Math.PI * 2);
  ctx.fill();
};

const drawHeader = (
  ctx: SKRSContext2D,
  width: number,
  y: number,
  title: string
) => {
  ctx.font = "bold 72px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, y);
};

const drawLineup = (
  ctx: SKRSContext2D,
  flow: MatchFlow,
  payload: {
    players: Player[];
    date: string;
    time: string;
    location: string;
  }
) => {
  const cfg = MATCH_TEMPLATE_CONFIG[flow].lineup;
  drawHeader(ctx, cfg.width, cfg.titleY, cfg.title);

  const orderedPlayers = [...payload.players]
    .sort((a, b) => a.jerseyNumber - b.jerseyNumber)
    .slice(0, cfg.maxPlayers);

  ctx.textAlign = "left";
  ctx.font = flow.endsWith("story") ? "600 38px Arial" : "600 30px Arial";

  orderedPlayers.forEach((player, idx) => {
    const y = cfg.playerStartY + idx * cfg.playerLineHeight;
    ctx.fillStyle = idx < 15 ? "#ffffff" : "#dbeafe";

    const name = truncateText(
      `${player.jerseyNumber}. ${player.lastName} ${player.firstName}`,
      flow.endsWith("story") ? 32 : 34
    );

    ctx.fillText(name, 120, y);
  });

  ctx.textAlign = "center";
  ctx.font = flow.endsWith("story") ? "500 34px Arial" : "500 26px Arial";
  ctx.fillStyle = "#f8fafc";
  const footer = `${truncateText(payload.location, 38)} | ${payload.date} | ${payload.time}`;
  ctx.fillText(footer, cfg.width / 2, cfg.metaY);
};

const loadRemoteImage = async (url?: string) => {
  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return await loadImage(buffer);
  } catch {
    return null;
  }
};

const drawLogoOrPlaceholder = async (
  ctx: SKRSContext2D,
  x: number,
  y: number,
  size: number,
  label: string,
  logoUrl?: string
) => {
  const image = await loadRemoteImage(logoUrl);
  if (image) {
    ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
    return;
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px Arial";
  ctx.fillText(label.slice(0, 2).toUpperCase(), x, y + 14);
};

const drawResult = async (
  ctx: SKRSContext2D,
  flow: MatchFlow,
  payload: {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    homeLogoUrl?: string;
    awayLogoUrl?: string;
    date?: string;
    location?: string;
  }
) => {
  const cfg = MATCH_TEMPLATE_CONFIG[flow].result;

  drawHeader(ctx, cfg.width, cfg.titleY, cfg.title);
  await drawLogoOrPlaceholder(
    ctx,
    cfg.homeX,
    cfg.logoY,
    cfg.logoSize,
    payload.homeTeam,
    payload.homeLogoUrl
  );
  await drawLogoOrPlaceholder(
    ctx,
    cfg.awayX,
    cfg.logoY,
    cfg.logoSize,
    payload.awayTeam,
    payload.awayLogoUrl
  );

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = flow.endsWith("story") ? "600 44px Arial" : "600 34px Arial";
  ctx.fillText(truncateText(payload.homeTeam, 16), cfg.homeX, cfg.teamY);
  ctx.fillText(truncateText(payload.awayTeam, 16), cfg.awayX, cfg.teamY);

  ctx.font = flow.endsWith("story") ? "bold 124px Arial" : "bold 96px Arial";
  ctx.fillText(String(payload.homeScore), cfg.homeX, cfg.scoreY);
  ctx.fillText(String(payload.awayScore), cfg.awayX, cfg.scoreY);

  ctx.font = flow.endsWith("story") ? "500 34px Arial" : "500 26px Arial";
  const dateAndLocation = [payload.date, payload.location].filter(Boolean).join(" | ");
  if (dateAndLocation) {
    ctx.fillText(truncateText(dateAndLocation, 42), cfg.width / 2, cfg.dateY);
  }
};

const renderAndUpload = async (input: RenderMatchImageInput) => {
  const baseConfig = input.flow.startsWith("lineup_")
    ? MATCH_TEMPLATE_CONFIG[input.flow].lineup
    : MATCH_TEMPLATE_CONFIG[input.flow].result;

  const canvas = createCanvas(baseConfig.width, baseConfig.height);
  const ctx = canvas.getContext("2d");

  fillBackground(
    ctx,
    baseConfig.width,
    baseConfig.height,
    input.branding?.primaryColor,
    input.branding?.secondaryColor
  );

  if (input.flow.startsWith("lineup_")) {
    const payload = input.payload as {
      players: Player[];
      date: string;
      time: string;
      location: string;
    };
    drawLineup(ctx, input.flow, payload);
  } else {
    const payload = input.payload as {
      homeTeam: string;
      awayTeam: string;
      homeScore: number;
      awayScore: number;
      homeLogoUrl?: string;
      awayLogoUrl?: string;
      date?: string;
      location?: string;
    };
    await drawResult(ctx, input.flow, payload);
  }

  const imagePath = makeImagePath(input.flow);
  const pngBuffer = await canvas.encode("png");
  const uploaded = await uploadMatchAsset(imagePath, pngBuffer, "image/png");

  return renderMatchImageOutputSchema.parse({
    imageUrl: uploaded.imageUrl,
    imagePath: uploaded.imagePath,
    width: baseConfig.width,
    height: baseConfig.height,
    flow: input.flow,
    provider: "local",
  });
};

export const renderMatchImageTool = tool({
  description: RENDER_MATCH_IMAGE_TOOL_PROMPT,
  inputSchema: renderMatchImageInputSchema,
  outputSchema: renderMatchImageOutputSchema,
  execute: async (input) => {
    return renderAndUpload(input);
  },
});
