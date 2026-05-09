import { LineupBuilderContainer } from "@/components/scrum/line-up/lineup-builder-container";

type LineUpPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function LineUpPage({ params }: LineUpPageProps) {
  const { matchId } = await params;

  return <LineupBuilderContainer matchId={matchId} />;
}
