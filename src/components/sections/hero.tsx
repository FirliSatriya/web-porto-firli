import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Download,
  MapPin,
  MousePointerClick,
  Sparkles,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useZeroG } from "@/components/zero-g-provider";
import { profile } from "@/lib/content";

type Tone = "high" | "mid" | "low";

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
        <div>
          <StatusPill />

          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-5xl lg:text-[3.4rem]">
            Engineering{" "}
            <span className="text-gradient-ink">Scalable Interfaces</span>{" "}
            Driven by{" "}
            <span className="relative whitespace-nowrap">
              <span className="text-gradient-ink">Data Intelligence</span>
              <svg
                className="absolute -bottom-2 left-0 h-2.5 w-full text-foreground/30"
                viewBox="0 0 200 10"
                fill="none"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7.5C40 3 90 2.5 198 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-pretty text-subtle sm:text-base">
            {profile.bio}
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button
              render={<a href="#works" />}
              nativeButton={false}
              size="lg"
              className="h-11 w-full rounded-full bg-primary px-6 text-[0.86rem] font-semibold text-primary-foreground shadow-[0_14px_40px_-14px_var(--glow)] transition-all hover:opacity-90 sm:w-auto"
            >
              View Flagship Projects
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </Button>

            <Button
              render={<a href="/resume" />}
              nativeButton={false}
              variant="ghost"
              size="lg"
              className="h-11 w-full rounded-full border border-hairline-strong px-6 text-[0.86rem] font-medium text-foreground hover:bg-surface-2 sm:w-auto"
            >
              <Download data-icon="inline-start" aria-hidden="true" />
              Download Resume
            </Button>
          </div>

          <div className="mt-6">
            <OpenTerminalButton />
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-hairline pt-6">
            {[
              { label: "Degree", value: "S.Tr.Kom." },
              { label: "Certified", value: "BNSP 2025" },
              { label: "Based in", value: "Surabaya" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-[0.62rem] tracking-[0.14em] text-faint uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 font-mono text-[0.82rem] text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <FloatingCluster />
      </div>

      <div className="mt-16 flex items-center justify-center gap-2 text-[0.65rem] tracking-[0.2em] text-faint uppercase sm:mt-20">
        <ArrowDown className="size-3 animate-bounce" aria-hidden="true" />
        scroll to explore
      </div>
    </section>
  );
}

function StatusPill() {
  return (
    <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-hairline bg-surface px-3.5 py-1.5 backdrop-blur-sm">
      <span className="flex items-center gap-2">
        <span
          className="animate-pulse-ring size-1.5 rounded-full bg-tone-high"
          aria-hidden="true"
        />
        <span className="text-[0.72rem] font-medium text-foreground">
          {profile.availability}
        </span>
      </span>
      <span className="hidden h-3 w-px bg-hairline-strong sm:block" aria-hidden="true" />
      <span className="hidden items-center gap-1.5 text-[0.7rem] text-subtle sm:flex">
        <MapPin className="size-3" aria-hidden="true" />
        {profile.location}
      </span>
    </div>
  );
}

function OpenTerminalButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-terminal"));
      }}
      className="group inline-flex items-center gap-2 font-mono text-[0.72rem] text-subtle transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="grid size-6 place-items-center rounded-md border border-hairline bg-surface text-foreground transition-colors group-hover:border-hairline-strong group-hover:bg-surface-2">
        <Terminal className="size-3" aria-hidden="true" />
      </span>
      Open Terminal
      <span className="rounded border border-hairline px-1 py-px text-[0.6rem] text-faint">
        âŒ˜K
      </span>
    </button>
  );
}

const clusterCards = [
  {
    key: "flagship",
    title: "DSS Â· MLBB Hero Selection",
    meta: "AHP + SAW Â· 132 heroes",
    accent: "high" as const,
    visual: "rank" as const,
    className: "left-0 top-0 w-[16.5rem] sm:w-[18.5rem] rotate-[-3deg]",
    depth: 1,
  },
  {
    key: "bhrs",
    title: "BHRIS Â· Basarnas",
    meta: "QR attendance + leave flow",
    accent: "mid" as const,
    visual: "qr" as const,
    className:
      "right-0 top-[7.5rem] w-[15rem] sm:w-[16.5rem] rotate-[2.5deg]",
    depth: 1.6,
  },
  {
    key: "telkom",
    title: "Telkom Â· Smart City Ops",
    meta: "Design system + OCR QC",
    accent: "low" as const,
    visual: "spark" as const,
    className:
      "left-[1.5rem] top-[15.5rem] w-[15.5rem] sm:left-[3rem] sm:w-[17rem] rotate-[1.5deg]",
    depth: 2.2,
  },
] as const;

function FloatingCluster() {
  const reduce = useReducedMotion();
  const { zeroG } = useZeroG();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, { stiffness: 130, damping: 18, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 130, damping: 18, mass: 0.4 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [16, -16]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [-14, 14]);
  const glowX = useTransform(springX, [-0.5, 0.5], ["18%", "82%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["12%", "88%"]);
  const glow = useMotionTemplate`radial-gradient(60% 60% at ${glowX} ${glowY}, var(--ambient), transparent 70%)`;

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      className="relative mx-auto h-[25rem] w-full max-w-[26rem] sm:h-[29rem] sm:max-w-[30rem] lg:h-[31rem]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ perspective: "1200px" }}
    >
      {/* ambient glow that follows the cursor */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{ backgroundImage: glow }}
      />

      {/* orbit rings */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 grid place-items-center"
      >
        <div className="size-[19rem] rounded-full border border-hairline sm:size-[22rem]" />
        <div className="absolute size-[14rem] rounded-full border border-hairline sm:size-[16rem]" />
        <div className="absolute size-[9rem] rounded-full border border-hairline" />
      </div>

      <motion.div
        className="relative h-full w-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {clusterCards.map((card, index) => (
          <motion.div
            key={card.key}
            className={`absolute ${card.className}`}
            style={{ zIndex: 10 - index }}
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.15 + index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              animate={
                reduce
                  ? undefined
                  : {
                      y: zeroG
                        ? [0, index % 2 === 0 ? -12 : -18, 0]
                        : [0, -2, 0],
                      rotate: zeroG
                        ? [0, index % 2 === 0 ? 1.1 : -1.1, 0]
                        : 0,
                    }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 8 + index * 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.6,
                    }
              }
              style={{
                translateZ: card.depth * 26,
                transformStyle: "preserve-3d",
              }}
            >
              <GhostCard
                title={card.title}
                meta={card.meta}
                accent={card.accent}
                visual={card.visual}
              />
            </motion.div>
          </motion.div>
        ))}

        {/* floating chips */}
        <FloatingChip
          icon={<Sparkles className="size-3.5" aria-hidden="true" />}
          label="UI/UX"
          className="top-[2.5rem] right-[3rem]"
          tone="high"
        />
        <FloatingChip
          icon={<Braces className="size-3.5" aria-hidden="true" />}
          label="TypeScript"
          className="top-[13rem] left-[-0.75rem]"
          tone="low"
        />
        <FloatingChip
          icon={<MousePointerClick className="size-3.5" aria-hidden="true" />}
          label="Zero-friction"
          className="right-[1.5rem] bottom-[2.75rem]"
          tone="mid"
        />
      </motion.div>
    </div>
  );
}

/** Monochrome tone ladder: strong ink, mid grey, and a quiet outline. */
const toneMap = {
  high: "border-foreground/30 bg-foreground/[0.07] text-foreground",
  mid: "border-foreground/20 bg-foreground/[0.04] text-tone-mid",
  low: "border-hairline-strong bg-surface text-subtle",
} as const;

function GhostCard({
  title,
  meta,
  accent,
  visual,
}: {
  title: string;
  meta: string;
  accent: keyof typeof toneMap;
  visual: "rank" | "qr" | "spark";
}) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-3.5 shadow-[0_24px_60px_-32px_var(--glow)]">
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60 ${toneMap[accent]}`}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[0.78rem] font-semibold text-foreground">
            {title}
          </p>
          <p className="mt-1 truncate font-mono text-[0.63rem] text-faint">
            {meta}
          </p>
        </div>
        <span
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border ${toneMap[accent]}`}
          aria-hidden="true"
        >
          <ArrowUpRight className="size-3" />
        </span>
      </div>

      <GhostVisual variant={visual} accent={accent} />
    </div>
  );
}

const HAIRLINE_CLASS: Record<Tone, string> = {
  high: "bg-foreground",
  mid: "bg-tone-mid",
  low: "bg-tone-low",
};

const STROKE_CLASS: Record<Tone, string> = {
  high: "text-foreground",
  mid: "text-tone-mid",
  low: "text-tone-low",
};

function GhostVisual({
  variant,
  accent,
}: {
  variant: "rank" | "qr" | "spark";
  accent: Tone;
}) {
  if (variant === "rank") {
    // AHPâ†’SAW: decreasing weighted scores, so bars step down like a ranking.
    const values = [100, 84, 71, 58, 44, 31, 21];
    return (
      <div className="mt-3 flex h-7 items-end gap-1" aria-hidden="true">
        {values.map((value, index) => (
          <span
            key={value}
            className={`flex-1 rounded-sm ${
              index === 0 ? HAIRLINE_CLASS[accent] : "bg-surface-2"
            }`}
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "qr") {
    // Deterministic 6x6 QR-ish block, no randomness needed.
    const cells = Array.from({ length: 36 }, (_, index) => {
      const row = Math.floor(index / 6);
      const col = index % 6;
      const corner =
        (row < 2 && col < 2) || (row < 2 && col > 3) || (row > 3 && col < 2);
      return corner || (row + col) % 3 === 0 || (row * col) % 5 === 0;
    });

    return (
      <div className="mt-3 grid h-7 w-7 grid-cols-6 gap-px" aria-hidden="true">
        {cells.map((filled, index) => (
          <span
            key={index}
            className={`rounded-[1px] ${
              filled ? HAIRLINE_CLASS[accent] : "bg-surface-2"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-1" aria-hidden="true">
      <svg viewBox="0 0 120 28" className="h-7 w-full" fill="none">
        <path
          d="M2 22L18 16L34 19L50 9L66 13L82 5L98 10L118 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={STROKE_CLASS[accent]}
        />
      </svg>
    </div>
  );
}


function FloatingChip({
  icon,
  label,
  className,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  className: string;
  tone: keyof typeof toneMap;
}) {
  return (
    <motion.span
      className={`absolute hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] backdrop-blur-md sm:inline-flex ${toneMap[tone]} ${className}`}
      style={{ translateZ: 66 }}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {icon}
      {label}
    </motion.span>
  );
}
