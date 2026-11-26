import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hand, Orbit, RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Switch } from "@/components/ui/switch";
import { useZeroG } from "@/components/zero-g-provider";
import { useI18n, type SkillGroupContent } from "@/i18n";
import { type SkillGroupId, type Tone } from "@/lib/content";
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

type PillContent = Omit<Pill, "x" | "y">;

type SelectedGroup = "all" | SkillGroupId;

/** Long certification names get a compact pill label; the full text stays in
 *  the accessible name so nothing is lost for screen readers. */
function pillLabel(skill: string) {
  if (skill.startsWith("BNSP")) return "BNSP Certified · 2025–2028";
  return skill;
}

/** Every skill becomes one pill, tagged with the discipline it belongs to. */
function buildPills(
  filter: SelectedGroup,
  groups: SkillGroupContent[],
): PillContent[] {
  return groups
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

/**
 * Lay the pills out on a coarse grid so the first frame is already spread out
 * instead of stacked in one corner.
 */
function seedPills(
  items: PillContent[],
  width: number,
  height: number,
): Pill[] {
  // Never use more columns than there are pills: a filter with four pills should
  // spread them across the whole width instead of stacking them on the left.
  const cols = Math.max(1, Math.min(items.length, Math.round(width / 190)));
  // Enough rows that every pill gets its own cell instead of wrapping onto
  // the same top row and stacking.
  const rows = Math.max(
    1,
    Math.min(
      Math.ceil(items.length / cols),
      Math.max(1, Math.floor(height / 58)),
    ),
  );

  return items.map((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols) % rows;
    const cellW = width / cols;
    const cellH = height / rows;

    const pillWidth = Math.min(item.width, Math.max(96, width - 16));
    const pillHeight = item.height;

    // Deterministic jitter, not Math.random(): the seed must be stable across
    // re-renders so pills do not jump.
    const jitter = hashJitter(item.id);

    // Seeded pills can be rotated, so reserve the rotated bounds or the first
    // frame starts half-clipped.
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
}

export function SkillsArena() {
  const { zeroG, setZeroG, reducedMotion } = useZeroG();
  const { skillGroups, t } = useI18n();
  const [filter, setFilter] = React.useState<SelectedGroup>("all");
  const [hovered, setHovered] = React.useState<{
    id: string;
    text: string;
  } | null>(null);
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
            {t("arena.arena")}
          </span>

          <ButtonGroup aria-label={t("arena.filterAria")} className="flex-wrap">
            <Button
              size="sm"
              variant={filter === "all" ? "secondary" : "ghost"}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className="text-[0.7rem]"
            >
              {t("arena.all")}
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
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => resetRef.current?.()}
              aria-label={t("arena.reset")}
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
                aria-label={t("arena.zeroGAria")}
              />
            </label>
          </div>
        </div>

        <ArenaCanvas
          filter={filter}
          zeroG={zeroG}
          reducedMotion={reducedMotion}
          hoveredId={hovered?.id ?? null}
          setHovered={setHovered}
          resetRef={resetRef}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline px-4 py-2.5 text-[0.65rem] text-faint">
          <span className="inline-flex items-center gap-1.5">
            <Hand className="size-3" aria-hidden="true" />
            {t("arena.dragHint")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Orbit className="size-3" aria-hidden="true" />
            {zeroG ? t("arena.weightless") : t("arena.gravity")}
          </span>
          <span className="ml-auto font-mono text-[0.6rem]">
            {hovered?.text ?? t("arena.physics")}
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
  hoveredId,
  setHovered,
  resetRef,
}: {
  filter: SelectedGroup;
  zeroG: boolean;
  reducedMotion: boolean;
  hoveredId: string | null;
  setHovered: (value: { id: string; text: string } | null) => void;
  resetRef: React.RefObject<(() => void) | null>;
}) {
  const { skillGroups, t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [positions, setPositions] = React.useState<
    Record<string, PillState>
  >({});
  const [dragging, setDragging] = React.useState<string | null>(null);

  const worldRef = React.useRef<PillWorld | null>(null);
  const dragRef = React.useRef<{
    id: string;
    lastX: number;
    lastY: number;
    lastT: number;
    vx: number;
    vy: number;
  } | null>(null);
  /** The simulation effect must not re-run when only the toggle flips. */
  const zeroGRef = React.useRef(zeroG);
  const reducedMotionRef = React.useRef(reducedMotion);
  /** Signature of the pill set currently in the world. */
  const signatureRef = React.useRef<string | null>(null);

  const items = React.useMemo(
    () => buildPills(filter, skillGroups),
    [filter, skillGroups],
  );

  /** Which pill set is currently in the simulation. */
  const signature = React.useMemo(
    () => items.map((item) => item.id).join("|"),
    [items],
  );

  const seeds = React.useMemo(
    () => seedPills(items, size.width || 900, size.height || 420),
    [items, size.width, size.height],
  );

  /* ---------- size tracking ---------- */
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* ---------- zero-g toggle, without tearing the simulation down ---------- */
  React.useEffect(() => {
    zeroGRef.current = zeroG;
    worldRef.current?.setZeroG(zeroG);
  }, [zeroG]);

  /* ---------- reduced motion: keep drags alive, drop the ambient drift ------ */
  React.useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    worldRef.current?.setStill(reducedMotion);
  }, [reducedMotion]);

  /* ---------- the world follows the pill set, never the window size --------- */
  React.useEffect(() => {
    if (!size.width || !size.height) return;
    if (signatureRef.current === signature && worldRef.current) return;

    signatureRef.current = signature;
    const layout = seedPills(items, size.width, size.height).map(
      ({ id, width, height, x, y }) => ({ id, width, height, x, y }),
    );

    const world = worldRef.current;
    if (world) {
      // A filter change re-seeds in place, so the running loop keeps its target.
      world.reset(layout, zeroGRef.current);
    } else {
      const created = new PillWorld(
        size.width,
        size.height,
        layout,
        zeroGRef.current,
      );
      created.setStill(reducedMotionRef.current);
      worldRef.current = created;
    }
  }, [items, signature, size.width, size.height]);

  /* ---------- resize just re-bounds the field; pills keep their place ------ */
  React.useEffect(() => {
    worldRef.current?.resize(size.width, size.height);
  }, [size.width, size.height]);

  /* ---------- one animation loop for the lifetime of the arena ------------ */
  React.useEffect(() => {
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      const dt = last ? now - last : 16.667;
      last = now;

      const world = worldRef.current;
      if (world) {
        const next = world.step(dt);
        if (next) {
          setPositions(Object.fromEntries(next.map((pill) => [pill.id, pill])));
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- pointer plumbing ---------- */
  const toLocal = (event: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = toLocal(event);

    if (dragging) {
      const info = dragRef.current;

      if (info) {
        // Pointer events carry their own high-res timestamp, so the fling can be
        // measured without touching the (impure) clock during render.
        const dt = Math.max(event.timeStamp - info.lastT, 8);
        info.vx = (x - info.lastX) / dt;
        info.vy = (y - info.lastY) / dt;
        info.lastX = x;
        info.lastY = y;
        info.lastT = event.timeStamp;
      }

      worldRef.current?.drag(dragging, x, y);
      return;
    }

    worldRef.current?.setPointer(x, y);
  };

  const onPointerLeave = () => {
    if (dragging) return;
    worldRef.current?.clearPointer();
  };

  const startDrag = (id: string, event: React.PointerEvent) => {
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);

    const { x, y } = toLocal(event);
    dragRef.current = {
      id,
      lastX: x,
      lastY: y,
      lastT: event.timeStamp,
      vx: 0,
      vy: 0,
    };

    setDragging(id);
    worldRef.current?.grab(id, x, y);
  };

  const endDrag = () => {
    if (!dragging) return;

    const fling = dragRef.current;
    // Per-millisecond velocity, scaled into the engine's per-frame units.
    worldRef.current?.release(
      dragging,
      fling ? clamp(fling.vx * 14, -26, 26) : 0,
      fling ? clamp(fling.vy * 14, -26, 26) : 0,
    );

    dragRef.current = null;
    setDragging(null);
  };

  const reset = React.useCallback(() => {
    const world = worldRef.current;
    if (!world) return;

    dragRef.current = null;
    setDragging(null);
    setHovered(null);

    world.reset(
      seeds.map(({ id, width, height, x, y }) => ({
        id,
        width,
        height,
        x,
        y,
      })),
      zeroGRef.current,
    );
  }, [seeds, setHovered]);

  React.useEffect(() => {
    resetRef.current = reset;
  }, [reset, resetRef]);

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="relative h-[26rem] touch-none overflow-hidden select-none sm:h-[24rem] lg:h-[26rem]"
      role="region"
      aria-label={t("arena.regionAria")}
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
              onMouseEnter={() =>
                setHovered({
                  id: pill.id,
                  text: `${pill.group} · ${pill.label}`,
                })
              }
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
                hoveredId === pill.id ? "brightness-110" : ""
              }`}
              aria-label={t("arena.skillAria", {
                label: pill.label,
                group: pill.group,
              })}
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
          {t("arena.empty")}
        </p>
      ) : null}
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
