import * as React from "react";
import { motion } from "motion/react";
import {
  GraduationCap,
  ScanLine,
  ShieldCheck,
  Workflow,
  Gauge,
  Cpu,
} from "lucide-react";

import { certifications, systems, type Tone } from "@/lib/content";

/** Monochrome tone ladder shared by icon chips and dot markers. */
const TONE: Record<Tone, { text: string; ring: string; bg: string; dot: string }> = {
  high: {
    text: "text-foreground",
    ring: "border-foreground/25",
    bg: "bg-foreground/[0.07]",
    dot: "bg-foreground",
  },
  mid: {
    text: "text-tone-mid",
    ring: "border-hairline-strong",
    bg: "bg-surface-2",
    dot: "bg-tone-mid",
  },
  low: {
    text: "text-subtle",
    ring: "border-hairline",
    bg: "bg-surface",
    dot: "bg-tone-low",
  },
};

const ICONS = {
  algorithm: Cpu,
  design: Gauge,
  scan: ScanLine,
  flow: Workflow,
} as const;

export function Systems() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {systems.map((system, index) => {
          const Icon = ICONS[system.icon as keyof typeof ICONS] ?? Cpu;
          const tone = TONE[system.tone];

          return (
            <motion.article
              key={system.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden panel rounded-2xl p-4 transition-colors hover:border-hairline-strong"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-32 rounded-full bg-foreground/[0.04] blur-2xl"
              />
              <span
                className={`grid size-9 place-items-center rounded-xl border ${tone.ring} ${tone.bg} ${tone.text}`}
                aria-hidden="true"
              >
                <Icon className="size-4" />
              </span>
              <h3 className="mt-3 text-[0.88rem] font-semibold text-foreground">
                {system.title}
              </h3>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-pretty text-subtle">
                {system.detail}
              </p>
            </motion.article>
          );
        })}
      </div>

      <div className="panel rounded-2xl p-4">
        <h3 className="flex items-center gap-2 text-[0.78rem] font-semibold tracking-wide text-foreground">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Verified credentials
        </h3>

        <ul className="mt-4 grid gap-3">
          {certifications.map((cert) => {
            const tone = TONE[cert.tone];
            return (
              <li
                key={cert.name}
                className="rounded-xl border border-hairline bg-surface p-3"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-1 size-1.5 shrink-0 rounded-full ${tone.dot}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[0.8rem] leading-snug font-medium text-foreground">
                      {cert.name}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[0.68rem] text-subtle">
                      <span className="inline-flex items-center gap-1">
                        {cert.period === "S.Tr.Kom." ? (
                          <GraduationCap className="size-3" aria-hidden="true" />
                        ) : (
                          <ShieldCheck className="size-3" aria-hidden="true" />
                        )}
                        {cert.issuer}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-mono ${tone.text}`}>{cert.period}</span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 rounded-xl border border-dashed border-hairline-strong p-3">
          <p className="font-mono text-[0.6rem] tracking-[0.14em] text-faint uppercase">
            pipeline
          </p>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[0.62rem]">
            {["pairwise", "consistency", "weights", "SAW rank"].map(
              (step, index, arr) => (
                <React.Fragment key={step}>
                  <span className="rounded border border-hairline bg-surface px-1.5 py-0.5 text-subtle">
                    {step}
                  </span>
                  {index < arr.length - 1 ? (
                    <span className="text-faint" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </React.Fragment>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
