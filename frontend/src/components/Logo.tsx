import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" data-testid="logo-link" className="flex items-center gap-2.5" aria-label="Poonji Finance home">
      <svg width="36" height="36" viewBox="0 0 64 64" className="shrink-0">
        <defs>
          <linearGradient id="lg-mark" x1="0" y1="64" x2="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="#0B1324" stroke="#1E293B" />
        <rect width="64" height="64" rx="14" fill="url(#lg-mark)" opacity="0.18" />
        <path d="M22 50V14h11.5a10.5 10.5 0 0 1 0 21H22" fill="none" stroke="#F8FAFC" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 44l8-8m0 0h-6.5M38 36v6.5" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          Poonji<span className="text-sky-400"> Finance</span>
        </span>
      )}
    </Link>
  );
}
