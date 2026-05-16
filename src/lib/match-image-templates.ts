import { MatchFlow } from "@/lib/schemas";

export type TemplateDimensions = {
  width: number;
  height: number;
};

export type LineupTemplateConfig = TemplateDimensions & {
  title: string;
  titleY: number;
  playerStartY: number;
  playerLineHeight: number;
  metaY: number;
  maxPlayers: number;
};

export type ResultTemplateConfig = TemplateDimensions & {
  title: string;
  titleY: number;
  homeX: number;
  awayX: number;
  teamY: number;
  logoY: number;
  logoSize: number;
  scoreY: number;
  dateY: number;
};

export type MatchTemplateConfig = {
  lineup: LineupTemplateConfig;
  result: ResultTemplateConfig;
};

const commonLineup = {
  maxPlayers: 23,
};

export const MATCH_TEMPLATE_CONFIG: Record<MatchFlow, MatchTemplateConfig> = {
  lineup_story: {
    lineup: {
      width: 1080,
      height: 1920,
      title: "MATCHDAY LINEUP",
      titleY: 190,
      playerStartY: 330,
      playerLineHeight: 58,
      metaY: 1730,
      ...commonLineup,
    },
    result: {
      width: 1080,
      height: 1920,
      title: "FULL TIME",
      titleY: 240,
      homeX: 290,
      awayX: 790,
      teamY: 1220,
      logoY: 720,
      logoSize: 220,
      scoreY: 1000,
      dateY: 1710,
    },
  },
  lineup_post: {
    lineup: {
      width: 1080,
      height: 1350,
      title: "MATCHDAY LINEUP",
      titleY: 160,
      playerStartY: 270,
      playerLineHeight: 42,
      metaY: 1200,
      ...commonLineup,
    },
    result: {
      width: 1080,
      height: 1350,
      title: "FULL TIME",
      titleY: 180,
      homeX: 290,
      awayX: 790,
      teamY: 900,
      logoY: 430,
      logoSize: 180,
      scoreY: 750,
      dateY: 1240,
    },
  },
  result_story: {
    lineup: {
      width: 1080,
      height: 1920,
      title: "MATCHDAY LINEUP",
      titleY: 190,
      playerStartY: 330,
      playerLineHeight: 58,
      metaY: 1730,
      ...commonLineup,
    },
    result: {
      width: 1080,
      height: 1920,
      title: "FULL TIME",
      titleY: 240,
      homeX: 290,
      awayX: 790,
      teamY: 1220,
      logoY: 720,
      logoSize: 220,
      scoreY: 1000,
      dateY: 1710,
    },
  },
  result_post: {
    lineup: {
      width: 1080,
      height: 1350,
      title: "MATCHDAY LINEUP",
      titleY: 160,
      playerStartY: 270,
      playerLineHeight: 42,
      metaY: 1200,
      ...commonLineup,
    },
    result: {
      width: 1080,
      height: 1350,
      title: "FULL TIME",
      titleY: 180,
      homeX: 290,
      awayX: 790,
      teamY: 900,
      logoY: 430,
      logoSize: 180,
      scoreY: 750,
      dateY: 1240,
    },
  },
};
