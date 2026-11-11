import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Hand,
  Minus,
  Orbit,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Switch } from "@/components/ui/switch";
import { useZeroG } from "@/components/zero-g-provider";
import { skillGroups, type Tone } from "@/lib/content";
import { PillWorld, type PillSeed, type PillState } from "@/lib/physics/world";

const ACCENT_CLASS: Record<Tone, string> = {
  high: "border-foreground/35 bg-foreground/[0.08] text-foreground shadow-[0_0_28px_-16px_var(--glow)]",
  mid: "border-foreground/20 bg-surface-2 text-tone-mid shadow-[0_0_28px_-18px_var(--glow-soft)]",
  low: "border-hairline-strong bg-surface text-subtle",
};

const DOT_CLASS: Record<Tone, string> = {
  high: "bg-foreground",
  mid: "bg-tone-mid",
  low: "bg-tone-low",
};

type Pill = PillSeed & {
  label: string;
  group: string;
  tone: Tone;
};

type PillContent = Omit<Pill, "x" | "y" | "width" | "height"> & {
  width: number;
  height: number;
};

type SelectedGroup = "all" | (typeof skillGroups)[number]["id"];

/** Long certification names get a compact pill label; the full text stays in
 *  the accessible name so nothing is lost for screen readers. */
function pillLabel(skill: string) {
  if (skill.startsWith("BNSP")) return "BNSP Certified · 2025–2028";
  return skill;
}

/** Every skill becomes one pill, tagged with the discipline it belongs to. */
function buildPills(filter: SelectedGroup): PillContent[] {
  return skillGroups
    .filter((group) => filter === "all" || group.id === filter)
    .flatMap((group) =>
      group.skills.map((skill) => {
        const label = pillLabel(skill);
        return {
          id: `${group.id}-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          label,
          group: group.label,
          tone: group.tone,
          width: Math.max(74, label.length * 7.6 + 34),
          height: 34,
        };
      }),
    );
}

export function SkillsArena() {
  const { zeroG, setZeroG, reducedMotion } = useZeroG();
  const [filter, setFilter] = React.useState<SelectedGroup>("all");
  const [density, setDensity] = React.useState(1);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const resetRef = React.useRef<(() => void) | null>(null);

  return (
    <div className="mt-12">
      <div className="glass relative overflow-hidden rounded-3xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl"
        >
          <div className="grid-lines absolute inset-0 opacity-50" />
          <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-foreground/[0.06] blur-3xl" />
          <div className="absolute right-1/4 -bottom-24 h-64 w-64 rounded-full bg-foreground/[0.04] blur-3xl" />
        </div>

        <div className="relative flex flex-wrap items-center gap-2 border-b border-hairline px-4 py-3">
          <span className="mr-1 flex items-center gap-1.5 font-mono text-[0.64rem] tracking-[0.16em] text-faint uppercase">
            <Sparkles className="size-3 text-foreground" aria-hidden="true" />
            arena
          </span>

          <ButtonGroup aria-label="Filter skills by discipline" className="flex-wrap">
            <Button
              size="sm"
              variant={filter === "all" ? "secondary" : "ghost"}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className="text-[0.7rem]"
            >
              All
            </Button>
            {skillGroups.map((group) => (
              <Button
                key={group.id}
                size="sm"
                variant={filter === group.id ? "secondary" : "ghost"}
                onClick={() => setFilter(group.id)}
                aria-pressed={filter === group.id}
                className="text-[0.7rem]"
              >
                <span
                  className={`size-1.5 rounded-full ${DOT_CLASS[group.tone]}`}
                  aria-hidden="true"
                />
                {group.label}
              </Button>
            ))}
          </ButtonGroup>

          <div className="ml-auto flex items-center gap-2">
            <ButtonGroup aria-label="Pill size">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setDensity((d) => Math.max(0.8, +(d - 0.1).toFixed(2)))}
                aria-label="Shrink pills"
              >
                <Minus />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setDensity((d) => Math.min(1.35, +(d + 0.1).toFixed(2)))}
                aria-label="Enlarge pills"
              >
                <Plus />
              </Button>
            </ButtonGroup>

            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => resetRef.current?.()}
              aria-label="Reset skill pill positions"
              className="text-subtle hover:text-foreground"
            >
              <RotateCcw />
            </Button>

            <label
              htmlFor="zero-g-arena"
              className="flex cursor-pointer items-center gap-2 rounded-full border border-hairline bg-surface px-2.5 py-1"
            >
              <Orbit
                className={`size-3.5 ${zeroG ? "text-foreground" : "text-faint"}`}
                aria-hidden="true"
              />
              <span className="font-mono text-[0.65rem] text-subtle">
                zero-g
              </span>
              <Switch
                id="zero-g-arena"
                size="sm"
                checked={zeroG}
                onCheckedChange={setZeroG}
                aria-label="Toggle zero-gravity physics"
              />
            </label>
          </div>
        </div>

        <ArenaCanvas
          filter={filter}
          zeroG={zeroG}
          reducedMotion={reducedMotion}
          density={density}
          hovered={hovered}
          setHovered={setHovered}
          resetRef={resetRef}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline px-4 py-2.5 text-[0.65rem] text-faint">
          <span className="inline-flex items-center gap-1.5">
            <Hand className="size-3" aria-hidden="true" />
            drag a pill and release to fling it
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Orbit className="size-3" aria-hidden="true" />
            {zeroG ? "weightless drift enabled" : "gravity enabled"}
          </span>
          <span className="ml-auto font-mono text-[0.6rem]">
            {hovered ?? "physics · worker simulation"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ArenaCanvas({
  filter,
  zeroG,
  reducedMotion,
  density,
  hovered,
  setHovered,
  resetRef,
}: {
  filter: SelectedGroup;
  zeroG: boolean;
  reducedMotion: boolean;
  density: number;
  hovered: string | null;
  setHovered: (value: string | null) => void;
  resetRef: React.RefObject<(() => void) | null>;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [positions, setPositions] = React.useState<Record<string, PillState>>({});
  const [dragging, setDragging] = React.useState<string | null>(null);

  const workerRef = React.useRef<Worker | null>(null);
  const worldRef = React.useRef<PillWorld | null>(null);
  const pillsRef = React.useRef<Pill[]>([]);
  const rafRef = React.useRef<number | null>(null);
  const lastRef = React.useRef(0);
  const dragInfo = React.useRef<{
    id: string;
    lastX: number;
    lastY: number;
    lastT: number;
    vx: number;
    vy: number;
  } | null>(null);

  // Measured pill sizes are needed before seeding positions.
  const measureRefs = React.useRef(new Map<string, HTMLDivElement>());

  const items = React.useMemo(() => buildPills(filter), [filter]);

  /* ---------- size tracking ---------- */
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* ---------- seed positions ---------- */
  const seeds = React.useMemo<Pill[]>(() => {
    const width = size.width || 900;
    const height = size.height || 420;
    const cols = Math.max(2, Math.round(width / 190));
    // Enough rows that every pill gets its own cell instead of wrapping onto
    // the same top row and stacking.
    const rows = Math.max(
      2,
      Math.min(
        Math.ceil(items.length / cols),
        Math.max(2, Math.floor(height / 58)),
      ),
    );

    return items.map((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols) % rows;
      const cellW = width / cols;
      const cellH = height / rows;

      const measured = measureRefs.current.get(item.id);
      const maxPillWidth = Math.max(96, width - 16);
      const pillWidth = Math.min(
        (measured?.offsetWidth ?? item.width) * density,
        maxPillWidth,
      );
      const pillHeight = (measured?.offsetHeight ?? item.height) * density;

      // Deterministic jitter, not Math.random(): the seed must be stable across
      // re-renders so pills do not jump when the arena re-measures.
      const jitter = hashJitter(item.id);

      // Seeded pills are rotated up to ±0.22rad, so reserve the rotated bounds
      // or the first frame starts half-clipped.
      const seedAngle = 0.14;
      const cos = Math.cos(seedAngle);
      const sin = Math.sin(seedAngle);
      const halfW = (pillWidth * cos + pillHeight * sin) / 2;
      const halfH = (pillWidth * sin + pillHeight * cos) / 2;

      return {
        ...item,
        width: pillWidth,
        height: pillHeight,
        x: clamp(
          cellW * col + cellW / 2 + jitter.x * 22,
          halfW + 4,
          Math.max(halfW + 4, width - halfW - 4),
        ),
        y: clamp(
          cellH * row + cellH / 2 + jitter.y * 18,
          halfH + 4,
          Math.max(halfH + 4, height - halfH - 4),
        ),
      };
    });
  }, [items, size.width, size.height, density]);

  /* ---------- boot the simulation ---------- */
  React.useEffect(() => {
    if (!size.width || !size.height) return;

    pillsRef.current = seeds;

    const seedsPayload = seeds.map(({ id, width, height, x, y }) => ({
      id,
      width,
      height,
      x,
      y,
    }));

    // Worker is the fast path; a same-thread world keeps it usable when
    // workers or the bundler's worker transform are unavailable.
    if (!workerRef.current && typeof Worker !== "undefined") {
      try {
        const worker = new Worker(
          new URL("../../lib/physics/worker.ts", import.meta.url),
          { type: "module" },
        );
        worker.onmessage = (event: MessageEvent<{ type: string; pills: PillState[] }>) => {
          if (event.data?.type === "tick") {
            setPositions(
              Object.fromEntries(event.data.pills.map((pill) => [pill.id, pill])),
            );
          }
        };
        workerRef.current = worker;
      } catch {
        workerRef.current = null;
      }
    }

    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "init",
        width: size.width,
        height: size.height,
        pills: seedsPayload,
        zeroG,
      });
    } else {
      const world = new PillWorld((message) => {
        if (message.type === "tick") {
          setPositions(
            Object.fromEntries(message.pills.map((pill) => [pill.id, pill])),
          );
        }
      });
      world.init(size.width, size.height, seedsPayload, zeroG);
      worldRef.current = world;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeds, size.width, size.height]);

  /* ---------- animation clock ---------- */
  React.useEffect(() => {
    if (reducedMotion) return;

    const tick = (now: number) => {
      const dt = lastRef.current ? now - lastRef.current : 16.667;
      lastRef.current = now;

      const worker = workerRef.current;
      const world = worldRef.current;

      if (worker) {
        worker.postMessage({ type: "step", dt });
      } else if (world) {
        world.step(dt);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = 0;
    };
  }, [reducedMotion]);

  /* ---------- react to toggles ---------- */
  React.useEffect(() => {
    workerRef.current?.postMessage({ type: "toggle", zeroG });
    worldRef.current?.setZeroG(zeroG);
  }, [zeroG]);

  React.useEffect(() => {
    if (!size.width || !size.height) return;
    workerRef.current?.postMessage({
      type: "resize",
      width: size.width,
      height: size.height,
    });
    worldRef.current?.resize(size.width, size.height);
  }, [size.width, size.height]);

  /* ---------- pointer plumbing ---------- */
  const toLocal = (event: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = toLocal(event);

    if (dragging) {
      const now = performance.now();
      const info = dragInfo.current;

      if (info) {
        const dt = Math.max(now - info.lastT, 8);
        // Smoothed velocity so the fling follows the last real gesture.
        info.vx = (x - info.lastX) / dt;
        info.vy = (y - info.lastY) / dt;
        info.lastX = x;
        info.lastY = y;
        info.lastT = now;
      }

      workerRef.current?.postMessage({
        type: "drag",
        id: dragging,
        pointerX: x,
        pointerY: y,
      });
      worldRef.current?.drag(dragging, x, y);
      return;
    }

    workerRef.current?.postMessage({ type: "pointer", x, y });
    worldRef.current?.setPointer(x, y);
  };

  const onPointerLeave = () => {
    workerRef.current?.postMessage({ type: "pointer-leave" });
    worldRef.current?.clearPointer();
  };

  const startDrag = (id: string, event: React.PointerEvent) => {
    event.preventDefault();
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    const { x, y } = toLocal(event);
    setDragging(id);
    dragInfo.current = {
      id,
      lastX: x,
      lastY: y,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
    };

    workerRef.current?.postMessage({ type: "grab", id, pointerX: x, pointerY: y });
    worldRef.current?.grab(id, x, y);
  };

  const endDrag = () => {
    if (!dragging) return;

    const fling = dragInfo.current;

    workerRef.current?.postMessage({ type: "release", id: dragging });
    worldRef.current?.release(dragging);

    // A released pill keeps its momentum: velocity is per-millisecond, so scale
    // it into the physics engine's per-frame units.
    if (fling && (Math.abs(fling.vx) > 0.002 || Math.abs(fling.vy) > 0.002)) {
      const kickX = clamp(fling.vx * 14, -22, 22);
      const kickY = clamp(fling.vy * 14, -22, 22);
      workerRef.current?.postMessage({
        type: "kick",
        id: fling.id,
        vx: kickX,
        vy: kickY,
      });
      worldRef.current?.kick(fling.id, kickX, kickY);
    }

    dragInfo.current = null;
    setDragging(null);
  };

  const reset = () => {
    if (!size.width || !size.height) return;
    workerRef.current?.postMessage({
      type: "init",
      width: size.width,
      height: size.height,
      pills: seeds.map(({ id, width, height, x, y }) => ({ id, width, height, x, y })),
      zeroG,
    });
    worldRef.current?.init(
      size.width,
      size.height,
      seeds.map(({ id, width, height, x, y }) => ({ id, width, height, x, y })),
      zeroG,
    );
  };

  React.useEffect(() => {
    resetRef.current = reset;
  });

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-[26rem] touch-none overflow-hidden select-none sm:h-[24rem] lg:h-[26rem]"
        role="region"
        aria-label="Interactive zero-gravity skills arena"
      >
        <AnimatePresence initial={false}>
          {seeds.map((pill) => {
            const state = positions[pill.id];
            const x = state?.x ?? pill.x;
            const y = state?.y ?? pill.y;
            const angle = state?.angle ?? 0;
            const isDragging = dragging === pill.id;

            return (
              <motion.div
                key={pill.id}
                ref={(node) => {
                  if (node) measureRefs.current.set(pill.id, node);
                  else measureRefs.current.delete(pill.id);
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: 1,
                  scale: isDragging ? 1.08 : 1,
                  x: x - pill.width / 2,
                  y: y - pill.height / 2,
                }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  x: { duration: 0 },
                  y: { duration: 0 },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.18 },
                }}
                onPointerDown={(event) => startDrag(pill.id, event)}
                onMouseEnter={() => setHovered(`${pill.group} · ${pill.label}`)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: pill.width,
                  height: pill.height,
                  rotate: `${angle}rad`,
                  touchAction: "none",
                }}
                className={`absolute top-0 left-0 flex cursor-grab items-center gap-1.5 overflow-hidden rounded-full border px-3 font-mono text-[0.68rem] whitespace-nowrap backdrop-blur-sm transition-colors ${
                  ACCENT_CLASS[pill.tone]
                } ${isDragging ? "cursor-grabbing ring-2 ring-ring" : ""} ${
                  hovered?.endsWith(pill.label) ? "brightness-110" : ""
                }`}
                aria-label={`${pill.label} — ${pill.group} skill`}
              >
                <span
                  className={`size-1.5 shrink-0 rounded-full ${DOT_CLASS[pill.tone]}`}
                  aria-hidden="true"
                />
                <span className="truncate">{pill.label}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!seeds.length ? (
          <p className="absolute inset-0 grid place-items-center text-sm text-subtle">
            No skills in this category.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Stable pseudo-random offsets derived from an id, never from Math.random(). */
function hashJitter(id: string) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(index);
    hash |= 0;
  }

  const a = ((hash & 0xff) / 255) * 2 - 1;
  const b = (((hash >> 8) & 0xff) / 255) * 2 - 1;
  return { x: a, y: b };
}
