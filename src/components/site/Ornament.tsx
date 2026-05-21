export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" aria-hidden>
        <path d="M14 1 L17 7 L14 13 L11 7 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <circle cx="2" cy="7" r="1" fill="currentColor" />
        <circle cx="26" cy="7" r="1" fill="currentColor" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
