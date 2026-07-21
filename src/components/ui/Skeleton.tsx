import { cn } from "@/lib/utils";

/** Placeholder con efecto shimmer para estados de carga. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-arena/60",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-marfil/60 after:to-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}
