type OverviewHeaderCardProps = {
  title: string;
  subtitle: string;
};

export function OverviewHeaderCard({ title, subtitle }: OverviewHeaderCardProps) {
  return (
    <section className="flex justify-between items-end">
      <div>
        <h1 className="font-display-title text-on-surface">{title}</h1>
        <p className="font-subtitle text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </section>
  );
}
