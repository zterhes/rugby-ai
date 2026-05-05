import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { apiErrorSchema } from "@/lib/api/contracts/common";
import {
  playerSchema,
  playersListQuerySchema,
  playersListResponseSchema,
  playerResponseSchema,
  playerCreateRequestSchema,
  playerCreateResponseSchema,
  playerUpdateRequestSchema,
  playerUpdateResponseSchema,
} from "@/lib/api/contracts/players";
import {
  teamsListQuerySchema,
  teamsListResponseSchema,
  teamCreateRequestSchema,
  teamCreateResponseSchema,
  teamSchema,
} from "@/lib/api/contracts/teams";
import {
  scheduleListQuerySchema,
  scheduleListResponseSchema,
  scheduleCreateRequestSchema,
  scheduleCreateResponseSchema,
  scheduleMatchSchema,
} from "@/lib/api/contracts/schedule";
import { rosterSummaryResponseSchema } from "@/lib/api/contracts/roster";
import { dashboardOverviewResponseSchema } from "@/lib/api/contracts/dashboard";

const registry = new OpenAPIRegistry();

const ApiError = registry.register("ApiError", apiErrorSchema);
registry.register("Player", playerSchema);
registry.register("Team", teamSchema);
registry.register("ScheduleMatch", scheduleMatchSchema);

registry.registerPath({
  method: "get",
  path: "/api/v1/players",
  request: { query: playersListQuerySchema },
  responses: {
    200: { description: "Players list", content: { "application/json": { schema: playersListResponseSchema } } },
    400: { description: "Bad request", content: { "application/json": { schema: ApiError } } },
  },
  tags: ["Players"],
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/players/{id}",
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { "application/json": { schema: playerUpdateRequestSchema } } },
  },
  responses: {
    200: { description: "Updated stub player", content: { "application/json": { schema: playerUpdateResponseSchema } } },
    400: { description: "Bad request", content: { "application/json": { schema: ApiError } } },
    404: { description: "Not found", content: { "application/json": { schema: ApiError } } },
  },
  tags: ["Players"],
});

registry.registerPath({
  method: "post",
  path: "/api/v1/players",
  request: { body: { content: { "application/json": { schema: playerCreateRequestSchema } } } },
  responses: {
    201: { description: "Created stub player", content: { "application/json": { schema: playerCreateResponseSchema } } },
    400: { description: "Bad request", content: { "application/json": { schema: ApiError } } },
  },
  tags: ["Players"],
});

registry.registerPath({
  method: "get",
  path: "/api/v1/players/{id}",
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: "Player", content: { "application/json": { schema: playerResponseSchema } } },
    404: { description: "Not found", content: { "application/json": { schema: ApiError } } },
  },
  tags: ["Players"],
});

registry.registerPath({
  method: "get",
  path: "/api/v1/teams",
  request: { query: teamsListQuerySchema },
  responses: {
    200: { description: "Teams", content: { "application/json": { schema: teamsListResponseSchema } } },
  },
  tags: ["Teams"],
});

registry.registerPath({
  method: "post",
  path: "/api/v1/teams",
  request: { body: { content: { "application/json": { schema: teamCreateRequestSchema } } } },
  responses: {
    201: { description: "Created stub team", content: { "application/json": { schema: teamCreateResponseSchema } } },
    400: { description: "Bad request", content: { "application/json": { schema: ApiError } } },
  },
  tags: ["Teams"],
});

registry.registerPath({
  method: "get",
  path: "/api/v1/schedule/matches",
  request: { query: scheduleListQuerySchema },
  responses: {
    200: { description: "Schedule matches", content: { "application/json": { schema: scheduleListResponseSchema } } },
  },
  tags: ["Schedule"],
});

registry.registerPath({
  method: "post",
  path: "/api/v1/schedule/matches",
  request: { body: { content: { "application/json": { schema: scheduleCreateRequestSchema } } } },
  responses: {
    201: { description: "Created stub match", content: { "application/json": { schema: scheduleCreateResponseSchema } } },
    400: { description: "Bad request", content: { "application/json": { schema: ApiError } } },
  },
  tags: ["Schedule"],
});

registry.registerPath({
  method: "get",
  path: "/api/v1/roster/summary",
  responses: {
    200: { description: "Roster summary", content: { "application/json": { schema: rosterSummaryResponseSchema } } },
  },
  tags: ["Roster"],
});

registry.registerPath({
  method: "get",
  path: "/api/v1/dashboard/overview",
  responses: {
    200: { description: "Dashboard overview", content: { "application/json": { schema: dashboardOverviewResponseSchema } } },
  },
  tags: ["Dashboard"],
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Rugby AI API",
      version: "1.0.0",
      description: "Contract-first API for roster, schedule, teams, and dashboard.",
    },
    servers: [{ url: "/" }]
  });
}
