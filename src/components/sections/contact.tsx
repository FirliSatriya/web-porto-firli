import * as React from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { useCopy } from "@/hooks/use-copy";
import { profile } from "@/lib/content";

export function Contact() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-5 sm:p-7"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-foreground/[0.06] blur-3xl"
        />

        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Let&apos;s build something with zero friction.
        </h3>
        <p className="mt-2 max-w-md text-[0.85rem] leading-relaxed text-pretty text-subtle">
          Open to Front-End and UI/UX roles where interface craft and data
          reasoning both matter. Fastest route is email â€” the copy buttons save
          you the typing.
        </p>

        <div className="mt-6 space-y-2.5">
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

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button
            render={<a href={profile.linkedin} target="_blank" rel="noreferrer noopener" />}
            nativeButton={false}
            className="h-9 rounded-full bg-primary px-4 text-[0.78rem] font-semibold text-primary-foreground hover:opacity-90"
          >
            <LinkedInIcon className="size-3.5" />
            Connect on LinkedIn
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Button>

          <Button
            variant="outline"
            render={<a href="https://github.com/FirliSatriya" target="_blank" rel="noreferrer noopener" />}
            nativeButton={false}
            className="h-9 rounded-full border-hairline-strong bg-surface px-4 text-[0.78rem] text-foreground hover:bg-surface-2"
          >
            <GitHubIcon className="size-3.5" />
            GitHub
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.dispatchEvent(new CustomEvent("open-terminal"))}
            className="h-9 rounded-full px-3 text-[0.75rem] text-subtle hover:text-foreground"
          >
            <Terminal className="size-3.5" aria-hidden="true" />
            terminal
          </Button>
        </div>

        <p className="mt-5 flex items-center gap-1.5 text-[0.7rem] text-faint">
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

      <div className="grid gap-3">
        <div className="panel rounded-3xl p-5">
          <p className="font-mono text-[0.6rem] tracking-[0.16em] text-faint uppercase">
            verified links
          </p>
          <ul className="mt-3 grid gap-2">
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center justify-between gap-2 rounded-xl border border-hairline bg-surface px-3 py-2.5 transition-colors hover:border-hairline-strong hover:bg-surface-2"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <LinkedInIcon className="size-4 shrink-0 text-foreground" />
                  <span className="min-w-0">
                    <span className="block text-[0.76rem] text-foreground">
                      LinkedIn
                    </span>
                    <span className="block truncate font-mono text-[0.62rem] text-subtle">
                      {profile.linkedinLabel}
                    </span>
                  </span>
                </span>
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:text-foreground"
                  aria-hidden="true"
                />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center justify-between gap-2 rounded-xl border border-hairline bg-surface px-3 py-2.5 transition-colors hover:border-hairline-strong hover:bg-surface-2"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-tone-mid" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-[0.76rem] text-foreground">
                      Email
                    </span>
                    <span className="block truncate font-mono text-[0.62rem] text-subtle">
                      {profile.email}
                    </span>
                  </span>
                </span>
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:text-foreground"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>
        </div>

        <div className="panel rounded-3xl p-5">
          <p className="font-mono text-[0.6rem] tracking-[0.16em] text-faint uppercase">
            quick vcard
          </p>
          <p className="mt-2 text-[0.78rem] leading-relaxed text-subtle">
            Grab the essentials in one line â€” paste into any ATS or message.
          </p>
          <div className="mt-3">
            <ButtonGroup className="w-full">
              <ButtonGroupText className="w-full justify-between border-hairline bg-surface font-mono text-[0.64rem] text-subtle">
                <span className="truncate">{profile.name}</span>
              </ButtonGroupText>
              <VCardCopyButton />
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
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

function VCardCopyButton() {
  const { copied, copy } = useCopy();

  const vcard = `${profile.name} â€” ${profile.title}\n${profile.email} Â· ${profile.phone}\n${profile.linkedin}\n${profile.location}`;

  return (
    <Button
      size="sm"
      onClick={() => copy(vcard)}
      aria-label="Copy contact summary"
      className="shrink-0 bg-surface-2 text-[0.65rem] text-foreground hover:bg-surface-2/80"
    >
      {copied ? (
        <Check className="size-3" aria-hidden="true" />
      ) : (
        <Copy className="size-3" aria-hidden="true" />
      )}
      {copied ? "copied" : "copy"}
    </Button>
  );
}
