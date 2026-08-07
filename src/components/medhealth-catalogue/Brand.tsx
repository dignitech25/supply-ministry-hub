/** Supply Ministry mark: a rounded arc stroke over a filled figure. */
export function ArcMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <path
        d="M8 27a16 16 0 0 1 32 0"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="35" r="7" fill="currentColor" />
    </svg>
  );
}

export function SupplyMinistryLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" style={{ color: "#3D2D9E" }}>
      <ArcMark className={compact ? "h-7 w-7" : "h-9 w-9"} />
      <span
        className={`font-semibold tracking-tight ${compact ? "text-base" : "text-xl"}`}
        style={{ fontFamily: "Outfit, system-ui, sans-serif" }}
      >
        Supply Ministry
      </span>
    </div>
  );
}

/**
 * MedHealth wordmark, drawn inline in their real logo colours
 * (charcoal / petrol / amber / red) so it renders reliably.
 * Swap point: replace with the supplied MedHealth logo file when available.
 */
export function MedHealthLogo({ className = "h-[1.05em]" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1 align-baseline ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-[0.9em] w-[0.9em] self-center"
        role="img"
        aria-label="MedHealth"
      >
        <rect x="1" y="1" width="10" height="10" rx="2" fill="#2A5263" />
        <rect x="13" y="1" width="10" height="10" rx="2" fill="#FCB040" />
        <rect x="1" y="13" width="10" height="10" rx="2" fill="#EC1C24" />
        <rect x="13" y="13" width="10" height="10" rx="2" fill="#231F20" />
      </svg>
      <span className="font-semibold" style={{ fontFamily: "Outfit, system-ui, sans-serif", color: "#231F20" }}>
        Med<span style={{ color: "#2A5263" }}>Health</span>
      </span>
    </span>
  );
}
