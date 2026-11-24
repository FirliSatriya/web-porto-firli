import * as React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { useCopy } from "@/hooks/use-copy";
import { profile } from "@/lib/content";

export function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative mt-10 overflow-hidden rounded-3xl p-5 sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-foreground/[0.06] blur-3xl"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Let&apos;s build something with zero friction.
          </h3>
          <p className="mt-1.5 text-[0.82rem] text-subtle">
            Open to Front-End &amp; UI/UX roles. Email is fastest.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            render={
              <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" />
            }
            nativeButton={false}
            className="h-9 rounded-full bg-primary px-4 text-[0.78rem] font-semibold text-primary-foreground hover:opacity-90"
          >
            <LinkedInIcon className="size-3.5" />
            LinkedIn
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            render={
              <a href="https://github.com/FirliSatriya" target="_blank" rel="noreferrer noopener" />
            }
            nativeButton={false}
            className="h-9 rounded-full border-hairline-strong bg-surface px-4 text-[0.78rem] text-foreground hover:bg-surface-2"
          >
            <GitHubIcon className="size-3.5" />
            GitHub
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <CopyRow
          icon={<Mail className="size-4" aria-hidden="true" />}
          label="Email"
          value={profile.email}
          href={`mailto:${profile.email}`}
          tone="high"
        />
        <CopyRow
          icon={<Phone className="size-4" aria-hidden="true" />}
          label="Phone"
          value={profile.phone}
          href={`tel:${profile.phoneHref}`}
          tone="mid"
        />
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-1.5 text-[0.7rem] text-faint">
        <MapPin className="size-3" aria-hidden="true" />
        {profile.location}
        <span className="mx-1 h-3 w-px bg-hairline-strong" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5">
          <span
            className="animate-pulse-ring size-1.5 rounded-full bg-tone-high"
            aria-hidden="true"
          />
          {profile.availability}
        </span>
      </p>
    </motion.div>
  );
}

const TONE_MAP = {
  high: {
    icon: "border-foreground/25 bg-foreground/[0.07] text-foreground",
    hover: "hover:border-hairline-strong",
  },
  mid: {
    icon: "border-hairline-strong bg-surface-2 text-tone-mid",
    hover: "hover:border-hairline-strong",
  },
} as const;

function CopyRow({
  icon,
  label,
  value,
  href,
  tone: toneKey,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  tone: keyof typeof TONE_MAP;
}) {
  const { copied, copy } = useCopy();
  const tone = TONE_MAP[toneKey];

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-hairline bg-surface p-2 transition-colors ${tone.hover}`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-lg border ${tone.icon}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.58rem] tracking-[0.12em] text-faint uppercase">
          {label}
        </p>
        <a
          href={href}
          className="block truncate font-mono text-[0.74rem] text-foreground transition-colors hover:text-tone-mid focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {value}
        </a>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copy(value)}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="shrink-0 text-[0.65rem] text-subtle hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        <span className="sr-only" role="status">
          {copied ? `${label} copied to clipboard` : ""}
        </span>
      </Button>
    </div>
  );
}
