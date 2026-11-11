import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gallery, type GalleryItem } from "@/lib/gallery";
import type { Tone } from "@/lib/content";

/** Offset hard shadow per tone: the wall reads as stacked prints, not cards. */
const TONE_SHADOW: Record<Tone, string> = {
  high: "shadow-[7px_7px_0_0_var(--hairline-strong)] hover:shadow-[12px_12px_0_0_var(--foreground)]",
  mid: "shadow-[7px_7px_0_0_var(--hairline)] hover:shadow-[12px_12px_0_0_var(--hairline-strong)]",
  low: "shadow-[7px_7px_0_0_var(--hairline)] hover:shadow-[12px_12px_0_0_var(--hairline-strong)]",
};

const pad = (value: number) => String(value).padStart(2, "0");

export function Gallery() {
  const [active, setActive] = React.useState<number | null>(null);
  const open = active !== null;

  const step = React.useCallback((direction: 1 | -1) => {
    setActive((current) => {
      if (current === null) return current;
      return (current + direction + gallery.length) % gallery.length;
    });
  }, []);

  // Arrow keys page through the wall while the lightbox is open. Escape is
  // handled by the dialog primitive itself. The listener must be capturing:
  // the dialog's focus manager stops keydown propagation before it bubbles.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKey, { capture: true });
    return () =>
      document.removeEventListener("keydown", onKey, { capture: true });
  }, [open, step]);

  const current = active === null ? null : gallery[active];

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.62rem] tracking-[0.16em] text-faint uppercase">
          {pad(gallery.length)} records
        </span>
        <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
        <span className="font-mono text-[0.62rem] text-faint">
          click any frame to open
        </span>
      </div>

      {/* Masonry wall. CSS columns keep each frame at its native ratio, so the
          vertical rhythm never needs a scripted measure pass. */}
      <div className="mt-6 columns-1 gap-7 sm:columns-2 lg:columns-3 [&>*]:break-inside-avoid">
        {gallery.map((item, index) => (
          <GalleryCard
            key={item.slug}
            item={item}
            index={index}
            onOpen={() => setActive(index)}
          />
        ))}
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setActive(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[92vh] max-w-[min(70rem,calc(100%-1rem))] flex-col gap-0 overflow-hidden rounded-2xl border border-hairline-strong bg-popover p-0 shadow-[0_40px_120px_-50px_var(--glow)] backdrop-blur-xl sm:max-w-[min(70rem,calc(100%-2rem))]"
          aria-describedby="lightbox-note"
        >
          {current ? (
            <LightboxBody
              item={current}
              index={active ?? 0}
              onClose={() => setActive(null)}
              onStep={step}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GalleryCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index % 3, 2) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-label={`View ${item.title} (${item.year})`}
      className={`group mb-7 block w-full overflow-hidden border border-hairline bg-card text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-x-1 hover:-translate-y-1 focus-visible:-translate-x-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${TONE_SHADOW[item.tone]}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

        <span
          aria-hidden="true"
          className="absolute top-3 left-3 z-10 bg-background/85 px-2 py-1 font-mono text-[0.6rem] tracking-[0.22em] text-foreground tabular-nums backdrop-blur-sm"
        >
          {pad(index + 1)}
        </span>

        {/* Hover reveal is desktop only; the caption moves under the frame on
            small screens, where hover does not exist. The scrim stays black in
            both themes so it reads over light and inverted artwork alike. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-black/88 via-black/45 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex"
        >
          <span className="mb-1 flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.22em] text-white/60 uppercase">
            {item.kind}
            <span className="text-white/30">/</span>
            {item.year}
          </span>
          <span className="translate-y-3 text-lg font-semibold tracking-[-0.01em] text-white transition-transform duration-300 group-hover:translate-y-0">
            {item.title}
          </span>
          <span className="mt-2 inline-flex translate-y-3 items-center gap-1.5 font-mono text-[0.62rem] text-white/70 delay-75 duration-300 group-hover:translate-y-0">
            <Expand className="size-3" aria-hidden="true" />
            [ VIEW ]
          </span>
        </div>
      </div>

      <span className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3 md:hidden">
        <span className="min-w-0 truncate text-[0.95rem] font-medium text-foreground">
          {item.title}
        </span>
        <span className="shrink-0 font-mono text-[0.68rem] text-subtle">
          {item.year}
        </span>
      </span>
    </motion.button>
  );
}

function LightboxBody({
  item,
  index,
  onClose,
  onStep,
}: {
  item: GalleryItem;
  index: number;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
        <span className="font-mono text-[0.62rem] tracking-[0.18em] text-subtle uppercase tabular-nums">
          {pad(index + 1)} / {pad(gallery.length)}
        </span>
        <span className="h-3 w-px bg-hairline-strong" aria-hidden="true" />
        <span className="truncate font-mono text-[0.62rem] text-subtle">
          {item.kind}
        </span>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous image"
            onClick={() => onStep(-1)}
            className="text-subtle hover:text-foreground"
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Next image"
            onClick={() => onStep(1)}
            className="text-subtle hover:text-foreground"
          >
            <ArrowRight />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close image viewer"
            onClick={onClose}
            className="text-subtle hover:text-foreground"
          >
            <X />
          </Button>
        </div>
      </div>

      {/* Stage: a neutral tint of the foreground keeps paper artwork readable in
          light mode and inverted artwork readable in dark mode. */}
      <div className="relative grid min-h-0 flex-1 place-items-center overflow-hidden bg-[color-mix(in_oklab,var(--foreground)_13%,var(--background))] px-2 py-3 sm:px-4 sm:py-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-full w-full items-center justify-center"
          >
            <img
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              decoding="async"
              className="max-h-[min(58vh,44rem)] w-auto max-w-full border border-hairline-strong object-contain"
            />
          </motion.div>
        </AnimatePresence>

        <Button
          variant="secondary"
          size="icon"
          aria-label="Previous image"
          onClick={() => onStep(-1)}
          className="absolute top-1/2 left-2 -translate-y-1/2 border border-hairline-strong bg-background/85 text-foreground backdrop-blur-md sm:left-3"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Next image"
          onClick={() => onStep(1)}
          className="absolute top-1/2 right-2 -translate-y-1/2 border border-hairline-strong bg-background/85 text-foreground backdrop-blur-md sm:right-3"
        >
          <ArrowRight />
        </Button>
      </div>

      <div className="border-t border-hairline px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <DialogTitle className="text-[0.98rem] font-semibold text-foreground">
            {item.title}
          </DialogTitle>
          <span className="font-mono text-[0.68rem] text-tone-mid">
            {item.year}
          </span>
        </div>
        <DialogDescription
          id="lightbox-note"
          className="mt-1.5 text-[0.78rem] leading-relaxed text-pretty text-subtle"
        >
          {item.note}
        </DialogDescription>
        <p className="mt-2 font-mono text-[0.6rem] tracking-[0.14em] text-faint uppercase">
          ← → to browse · esc to close
        </p>
      </div>
    </>
  );
}
