import { PlayerProfilePageContainer } from "@/components/scrum/roster/player-profile-page-container";

type PlayerProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    edit?: string;
  }>;
};

export default async function PlayerProfilePage({
  params,
  searchParams,
}: PlayerProfilePageProps) {
  const { id } = await params;
  const { edit } = await searchParams;

  return (
    <PlayerProfilePageContainer
      playerId={id}
      mode={edit === "true" ? "edit" : "view"}
    />
  );
}
