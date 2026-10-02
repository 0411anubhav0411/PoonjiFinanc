import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" data-testid="logo-link" className="flex items-center gap-2.5" aria-label="Poonji Finance home">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-md shadow-blue-900/10">
        <img src="/logo.png" alt="Poonji Finance logo" className="h-full w-full object-contain" />
      </span>
      {!compact && (
        <span className="hidden font-heading text-lg font-bold tracking-tight whitespace-nowrap text-foreground xl:block">
          Poonji<span className="text-gold"> Finance</span>
        </span>
      )}
    </Link>
  );
}
