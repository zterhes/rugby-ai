type DuesProgressRowCardProps = {
  label: string;
  value: string;
  progressWidthPercent: number;
  progressClassName: string;
};

export function DuesProgressRowCard({
  label,
  value,
  progressWidthPercent,
  progressClassName,
}: DuesProgressRowCardProps) {
  return (
    <div>
      <div className="flex justify-between font-body-ui text-secondary mb-2">
        <span>{label}</span>
        <span className="text-on-surface font-bold">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${progressClassName}`}
          style={{ width: `${progressWidthPercent}%` }}
        />
      </div>
    </div>
  );
}
