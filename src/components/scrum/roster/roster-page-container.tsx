"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RosterPageView } from "@/components/scrum/roster/roster-page-view";
import { type DuesStatus, type Player, type PlayerPosition } from "@/lib/data/players";
import { getPlayers, PLAYERS_QUERY_KEY } from "@/lib/data/players-query";

const POSITION_OPTIONS: Array<{
  value: "" | PlayerPosition;
  label: string;
}> = [
  { value: "", label: "All Positions" },
  { value: "prop", label: "Prop" },
  { value: "hooker", label: "Hooker" },
  { value: "lock", label: "Lock" },
  { value: "flanker", label: "Flanker" },
  { value: "number8", label: "Number 8" },
  { value: "scrumhalf", label: "Scrum-half" },
  { value: "flyhalf", label: "Fly-half" },
  { value: "centre", label: "Centre" },
  { value: "wing", label: "Wing" },
  { value: "fullback", label: "Fullback" },
];

const STATUS_OPTIONS: Array<{
  value: "" | DuesStatus;
  label: string;
}> = [
  { value: "", label: "Any Status" },
  { value: "paid", label: "Dues: Paid" },
  { value: "pending", label: "Dues: Pending" },
];

export function RosterPageContainer() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<"" | PlayerPosition>("");
  const [status, setStatus] = useState<"" | DuesStatus>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: PLAYERS_QUERY_KEY,
    queryFn: getPlayers,
  });

  const filteredPlayers = useMemo(() => {
    const players = data ?? [];
    const term = search.trim().toLowerCase();

    return players.filter((player) => {
      if (position && player.position !== position) return false;
      if (status && player.duesStatus !== status) return false;

      if (term) {
        const haystack = [
          player.name,
          player.positionLabel,
          player.email,
          player.licenseId,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      }

      return true;
    });
  }, [data, search, position, status]);

  const handleViewProfile = (player: Player) => {
    router.push(`/roster/${player.id}`);
  };

  const handleEditProfile = (player: Player) => {
    router.push(`/roster/${player.id}?edit=true`);
  };

  const handleAddPlayer = () => {
    router.push("/roster/new?new=true");
  };

  return (
    <RosterPageView
      search={search}
      position={position}
      status={status}
      filteredPlayers={filteredPlayers}
      positionOptions={POSITION_OPTIONS}
      statusOptions={STATUS_OPTIONS}
      isLoading={isLoading}
      isError={isError}
      onSearchChange={setSearch}
      onPositionChange={setPosition}
      onStatusChange={setStatus}
      onViewProfile={handleViewProfile}
      onEditProfile={handleEditProfile}
      onAddPlayer={handleAddPlayer}
    />
  );
}
