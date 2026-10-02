import { PARTNERS } from "@/data/content";

export function Marquee() {
  const row = [...PARTNERS, ...PARTNERS];
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/40 py-6" data-testid="partner-marquee">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track flex w-max items-center gap-14">
        {row.map((name, i) => (
          <span key={`${name}-${i}`} aria-hidden={i >= PARTNERS.length} className="flex items-center gap-14">
            <span className="font-heading text-sm font-semibold tracking-wide whitespace-nowrap text-muted-foreground/80">{name}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-red-600/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
