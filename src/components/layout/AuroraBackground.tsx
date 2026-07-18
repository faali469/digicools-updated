export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-aurora bg-[length:200%_200%] animate-aurora ${className}`}
    />
  );
}
