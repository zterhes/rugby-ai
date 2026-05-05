CREATE TABLE "schedule_matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"opponent_team_id" uuid NOT NULL,
	"fixture_type" varchar(8) NOT NULL,
	"date_iso" varchar(10) NOT NULL,
	"kickoff_time" varchar(16),
	"round_label" text,
	"meet_time" varchar(16),
	"kit_primary" text,
	"kit_secondary" text,
	"venue_name" text,
	"venue_address" text,
	"status" varchar(16) DEFAULT 'Upcoming' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo" text NOT NULL,
	"venue_map_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "position" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "position" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "license_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "caps" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "dues_status" varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule_matches" ADD CONSTRAINT "schedule_matches_opponent_team_id_teams_id_fk" FOREIGN KEY ("opponent_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;