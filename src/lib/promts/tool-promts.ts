import { env } from "@/env";

export const EXTRACT_MATCH_DATA_FROM_PDF_TOOL_PROMPT = `
Use this tool when the user attached a match report PDF and lineup data should be extracted.
You should pass the text content you can read from the attachment into sourceText.
If no explicit team is requested, focus extraction on ${env.TEAM_NAME}.
Only pass relevant lines so extraction quality stays high.
`;

export const RENDER_MATCH_IMAGE_TOOL_PROMPT = `
Use this tool to render match visuals for social media.
Supported flows: lineup_story, lineup_post, result_story, result_post.
Use lineup flows for player list visuals.
Use result flows for score visuals.
When required payload fields are missing, ask a targeted follow-up question before calling this tool.
`;
