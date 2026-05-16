import type { Player } from "@/lib/api/contracts/players";

export type LineupPlayer = Pick<Player, "id" | "name" | "avatarUrl" | "positionLabel">;

export type PitchPosition = {
  id: number;
  label: string;
  top: string;
  left: string;
};

export const PITCH_POSITIONS: PitchPosition[] = [
  { id: 1, label: "LOOSEHEAD", top: "15%", left: "13.33%" },
  { id: 2, label: "HOOKER", top: "15%", left: "30.00%" },
  { id: 3, label: "TIGHTHEAD", top: "15%", left: "46.66%" },
  { id: 4, label: "LOCK", top: "35%", left: "21.66%" },
  { id: 5, label: "LOCK", top: "35%", left: "38.33%" },
  { id: 6, label: "BLINDSIDE", top: "50%", left: "13.33%" },
  { id: 8, label: "NO. 8", top: "50%", left: "30.00%" },
  { id: 7, label: "OPENSIDE", top: "50%", left: "46.66%" },
  { id: 9, label: "SCRUM-HALF", top: "65%", left: "20.00%" },
  { id: 10, label: "FLY-HALF", top: "65%", left: "40.00%" },
  { id: 11, label: "WING", top: "80%", left: "5.00%" },
  { id: 12, label: "CENTER", top: "80%", left: "20.00%" },
  { id: 13, label: "CENTER", top: "80%", left: "38.33%" },
  { id: 14, label: "WING", top: "80%", left: "55.00%" },
  { id: 15, label: "FULL-BACK", top: "93%", left: "30.00%" },
  { id: 16, label: "SUBSTITUTE", top: "15%", left: "73%" },
  { id: 17, label: "SUBSTITUTE", top: "35%", left: "73%" },
  { id: 18, label: "SUBSTITUTE", top: "50%", left: "73%" },
  { id: 19, label: "SUBSTITUTE", top: "65%", left: "73%" },
  { id: 20, label: "SUBSTITUTE", top: "15%", left: "93%" },
  { id: 21, label: "SUBSTITUTE", top: "35%", left: "93%" },
  { id: 22, label: "SUBSTITUTE", top: "50%", left: "93%" },
  { id: 23, label: "SUBSTITUTE", top: "65%", left: "93%" },
];
