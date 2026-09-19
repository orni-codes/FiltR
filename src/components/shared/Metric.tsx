interface MetricProps {
  label: string;
  value: string | number;
}

export function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
