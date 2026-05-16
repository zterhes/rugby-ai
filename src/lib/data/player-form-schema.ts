import { z } from "zod";

const POSITION_VALUES = [
  "prop",
  "hooker",
  "lock",
  "flanker",
  "number8",
  "scrumhalf",
  "flyhalf",
  "centre",
  "wing",
  "fullback",
] as const;

const DUES_STATUS_VALUES = ["paid", "pending"] as const;

export const playerFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  position: z.enum(POSITION_VALUES, {
    error: "Position is required.",
  }),
  licenseId: z.string().trim().min(3, "License ID is required."),
  caps: z.coerce
    .number({ error: "Caps must be a valid number." })
    .int("Caps must be a whole number.")
    .min(0, "Caps cannot be negative."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(6, "Phone number is required."),
  avatarUrl: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^https?:\/\/.+/i.test(value), {
      message: "Avatar URL must be a valid http/https URL.",
    })
    .optional()
    .default(""),
  duesStatus: z.enum(DUES_STATUS_VALUES, {
    error: "Dues status is required.",
  }),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;

export type PlayerFormDraft = {
  name: string;
  position: PlayerFormValues["position"];
  licenseId: string;
  caps: string;
  email: string;
  phone: string;
  avatarUrl: string;
  duesStatus: PlayerFormValues["duesStatus"];
};

export type PlayerFormErrors = Partial<Record<keyof PlayerFormDraft, string>>;
