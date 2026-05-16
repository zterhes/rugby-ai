ALTER TABLE "schedule_matches" ADD COLUMN "kickoff_at" timestamp with time zone;
--> statement-breakpoint
UPDATE "schedule_matches"
SET "kickoff_at" = (
  ("date_iso" || 'T' || COALESCE(NULLIF("kickoff_time", ''), '00:00') || ':00Z')::timestamptz
);
--> statement-breakpoint
ALTER TABLE "schedule_matches" ALTER COLUMN "kickoff_at" SET NOT NULL;
