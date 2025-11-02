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
  const response = await apiTemplateIoClient.post("", requestBody, {
    params: {
      template_id: env.API_TEMPLATE_IO_ROSTER_STORY_ID,
    },
  });
  if (response.status !== 200) {
    throw new Error(`Failed to generate roster story: ${response.statusText}`);
  }
  return apiTemplateIoResponseSchema.parse(response.data);
};
