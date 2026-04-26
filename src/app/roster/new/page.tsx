import { redirect } from "next/navigation";
import { PlayerProfilePageContainer } from "@/components/scrum/roster/player-profile-page-container";

type NewPlayerPageProps = {
  searchParams: Promise<{
    new?: string;
  }>;
};

export default async function NewPlayerPage({ searchParams }: NewPlayerPageProps) {
  const { new: isNew } = await searchParams;

  if (isNew !== "true") {
    redirect("/roster/new?new=true");
  }

  return <PlayerProfilePageContainer mode="create" />;
}
