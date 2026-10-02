export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  testid,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  testid: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={testid} className="text-sm text-muted-foreground">{label}</label>
        <span className="font-mono text-sm font-semibold text-gold">{format(value)}</span>
      </div>
      <input
        id={testid}
        data-testid={testid}
        type="range"
        className="pf-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[11px] text-muted-foreground/70">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
