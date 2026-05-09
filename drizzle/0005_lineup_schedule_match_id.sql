ALTER TABLE "match_lineup_slots" RENAME COLUMN "match_id" TO "schedule_match_id";--> statement-breakpoint
ALTER TABLE "match_lineup_slots" RENAME CONSTRAINT "match_lineup_slots_match_id_pitch_position_uq" TO "match_lineup_slots_schedule_match_id_pitch_position_uq";--> statement-breakpoint
ALTER TABLE "match_lineup_slots" RENAME CONSTRAINT "match_lineup_slots_match_id_player_id_uq" TO "match_lineup_slots_schedule_match_id_player_id_uq";--> statement-breakpoint
ALTER TABLE "match_lineup_slots" RENAME CONSTRAINT "match_lineup_slots_match_id_schedule_matches_id_fk" TO "match_lineup_slots_schedule_match_id_schedule_matches_id_fk";
