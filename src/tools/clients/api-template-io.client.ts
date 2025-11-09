import axios from "axios";
import { env } from "@/env";
import {
  apiTemplateIoRequestBodySchema,
  apiTemplateIoResponseSchema,
} from "@/lib/schemas";
import { z } from "zod";

const apiTemplateIoClient = axios.create({
  baseURL: env.API_TEMPLATE_IO_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": env.API_TEMPLATE_IO_API_KEY,
  },
});

export const generateRosterStory = async (
  requestBody: z.infer<typeof apiTemplateIoRequestBodySchema>
) => {
  console.log("env.API_TEMPLATE_IO_URL", env.API_TEMPLATE_IO_URL);
  console.log(
    "env.API_TEMPLATE_IO_ROSTER_STORY_ID",
    env.API_TEMPLATE_IO_ROSTER_STORY_ID
  );
  console.log("env.API_TEMPLATE_IO_API_KEY", env.API_TEMPLATE_IO_API_KEY);
  console.log("requestBody", requestBody);
  console.log("url", apiTemplateIoClient.getUri());
  console.log("api-key", apiTemplateIoClient.defaults.headers["x-api-key"]);
  const response = await apiTemplateIoClient.post(
    "/create-image",
    requestBody,
    {
      params: {
        template_id: env.API_TEMPLATE_IO_ROSTER_STORY_ID,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error(`Failed to generate roster story: ${response.statusText}`);
  }
  const result = apiTemplateIoResponseSchema.safeParse(response.data);
  if (!result.success) {
    throw new Error(`Failed to generate roster story: ${result.error.message}`);
  }
  return result.data;
};
