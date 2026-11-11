export function VoidBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base wash: warm paper in light mode, void in dark mode */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,var(--surface-2)_0%,var(--background)_48%,var(--background)_100%)]" />

      {/* hairline grid */}
      <div className="grid-lines absolute inset-0 opacity-70 [mask-image:radial-gradient(90%_70%_at_50%_10%,#000_10%,transparent_75%)]" />

      {/* drifting monochrome fields */}
      <div className="animate-drift absolute -top-40 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--ambient),transparent_66%)] blur-2xl" />
      <div className="animate-float-slow absolute top-[38%] -left-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,var(--ambient-soft),transparent_68%)] blur-3xl" />
      <div className="animate-float absolute right-[-10%] bottom-[6%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--ambient-soft),transparent_68%)] blur-3xl" />

      {/* vignette + very faint scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,color-mix(in_oklab,var(--background)_45%,transparent)_78%,var(--background)_100%)]" />
      <div className="absolute inset-0 opacity-[0.025] [background-image:repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,var(--foreground)_3px,transparent_4px)]" />
    </div>
  );
}
