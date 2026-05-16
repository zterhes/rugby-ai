CREATE TABLE "match_lineup_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" integer NOT NULL,
	"pitch_position" smallint NOT NULL,
	"player_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_lineup_slots_match_id_pitch_position_uq" UNIQUE("match_id","pitch_position"),
	CONSTRAINT "match_lineup_slots_match_id_player_id_uq" UNIQUE("match_id","player_id"),
	CONSTRAINT "match_lineup_slots_pitch_position_range_ck" CHECK ("match_lineup_slots"."pitch_position" >= 1 AND "match_lineup_slots"."pitch_position" <= 23)
);
--> statement-breakpoint
ALTER TABLE "match_lineup_slots" ADD CONSTRAINT "match_lineup_slots_match_id_schedule_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."schedule_matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_lineup_slots" ADD CONSTRAINT "match_lineup_slots_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE restrict ON UPDATE no action;