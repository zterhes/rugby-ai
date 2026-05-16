import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  venueMapUrl: text("venue_map_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const players = pgTable("players", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  position: varchar("position", { length: 32 }).notNull(),
  licenseId: text("license_id").notNull(),
  caps: integer("caps").notNull().default(0),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  avatarUrl: text("avatar_url"),
  duesStatus: varchar("dues_status", { length: 16 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const scheduleMatches = pgTable("schedule_matches", {
  id: serial("id").primaryKey(),
  opponentTeamId: uuid("opponent_team_id")
    .notNull()
    .references(() => teams.id),
  fixtureType: varchar("fixture_type", { length: 8 }).notNull(),
  kickoffAt: timestamp("kickoff_at", { withTimezone: true }).notNull(),
  dateIso: varchar("date_iso", { length: 10 }).notNull(),
  kickoffTime: varchar("kickoff_time", { length: 16 }),
  roundLabel: text("round_label"),
  meetTime: varchar("meet_time", { length: 16 }),
  meetLocation: text("meet_location"),
  kitPrimary: text("kit_primary"),
  kitSecondary: text("kit_secondary"),
  venueName: text("venue_name"),
  venueAddress: text("venue_address"),
  status: varchar("status", { length: 16 }).notNull().default("Upcoming"),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const matchLineupSlots = pgTable(
  "match_lineup_slots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scheduleMatchId: integer("schedule_match_id")
      .notNull()
      .references(() => scheduleMatches.id, { onDelete: "cascade" }),
    pitchPosition: smallint("pitch_position").notNull(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("match_lineup_slots_schedule_match_id_pitch_position_uq").on(
      t.scheduleMatchId,
      t.pitchPosition,
    ),
    unique("match_lineup_slots_schedule_match_id_player_id_uq").on(
      t.scheduleMatchId,
      t.playerId,
    ),
    check(
      "match_lineup_slots_pitch_position_range_ck",
      sql`${t.pitchPosition} >= 1 AND ${t.pitchPosition} <= 23`,
    ),
  ],
);
