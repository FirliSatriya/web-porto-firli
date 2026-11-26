import * as React from "react";
import { motion } from "motion/react";
import {
  Check,
  Copy,
  CornerDownLeft,
  Terminal as TerminalIcon,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCopy } from "@/hooks/use-copy";
import { useZeroG } from "@/components/zero-g-provider";
import {
  useI18n,
  type CertificationContent,
  type LocalizedProject,
  type ProfileContent,
  type SkillGroupContent,
} from "@/i18n";
import type { MessageKey } from "@/i18n/messages";

type TFunction = (
  key: MessageKey,
  vars?: Record<string, string | number>,
) => string;

type LineKind = "out" | "ok" | "muted" | "warn" | "link" | "cmd";

type Line = { id: number; kind: LineKind; text: string };

let nextId = 0;

const line = (kind: LineKind, text = "") => ({
  id: nextId++,
  kind,
  text,
});

const ASYNC_KEYWORDS = ["whoami", "help", "skills", "contact", "clear"] as const;

const BANNER = String.raw`
  ______ _____    _____ _______     __
 |  ____/ ____|  / ____|__   __|   / /
 | |__ | (___   | (___    | |     / / 
 |  __| \___ \   \___ \   | |    / /  
 | |    ____) |  ____) |  | |   / /   
 |_|   |_____/  |_____/   |_|  /_/    
`;

function buildGreeting(t: TFunction): Line[] {
  return [
    line("muted", BANNER),
    line("ok", t("terminal.greeting")),
    line("muted", t("terminal.greetingHint")),
    line("muted", ""),
  ];
}

function runCommand(
  raw: string,
  ctx: {
    setZeroG: (v: boolean) => void;
    zeroG: boolean;
    t: TFunction;
    profile: ProfileContent;
    projects: LocalizedProject[];
    skillGroups: SkillGroupContent[];
    certifications: CertificationContent[];
  },
): { lines: Line[]; clear?: boolean; close?: boolean } {
  const { t, profile, projects, skillGroups, certifications } = ctx;
  const input = raw.trim();
  const [name, ...args] = input.split(/\s+/);
  const command = (name ?? "").toLowerCase();

  if (input === "") {
    return { lines: [] };
  }

  switch (command) {
    case "help":
      return {
        lines: [
          line("ok", t("terminal.helpTitle")),
          line("out", `  help        ${t("terminal.helpHelp")}`),
          line("out", `  whoami      ${t("terminal.helpWhoami")}`),
          line("out", `  skills      ${t("terminal.helpSkills")}`),
          line("out", `  projects    ${t("terminal.helpProjects")}`),
          line("out", `  certs       ${t("terminal.helpCerts")}`),
          line("out", `  contact     ${t("terminal.helpContact")}`),
          line("out", `  zero-g      ${t("terminal.helpZeroG")}`),
          line("out", `  clear       ${t("terminal.helpClear")}`),
          line("out", `  exit        ${t("terminal.helpExit")}`),
          line("muted", ""),
          line("muted", t("terminal.tip")),
        ],
      };

    case "whoami":
      return {
        lines: [
          line("ok", profile.name),
          line("out", `${profile.credential} — ${profile.degree}`),
          line("out", `${profile.university} · ${profile.location}`),
          line("muted", ""),
          line("out", profile.bio),
          line("muted", ""),
          line("ok", `${t("terminal.status")} ${profile.availability}`),
        ],
      };

    case "skills":
      return {
        lines: skillGroups.flatMap((group) => [
          line("ok", `${group.label} — ${group.blurb}`),
          line(
            "out",
            group.skills.map((skill) => `  · ${skill}`).join("\n"),
          ),
          line("muted", ""),
        ]),
      };

    case "projects":
    case "works":
    case "ls":
      return {
        lines: projects.flatMap((project) => [
          line(
            "ok",
            `${project.index}  ${project.title}`,
          ),
          line("muted", `     ${project.org} · ${project.role} · ${project.year}`),
          line("out", `     ${project.tagline}`),
          line("muted", `     ${project.stack.join(" / ")}`),
          line("muted", ""),
        ]),
      };

    case "certs":
    case "cert":
    case "certification":
      return {
        lines: certifications.flatMap((cert) => [
          line("ok", cert.name),
          line("muted", `     ${cert.issuer} · ${cert.period}`),
          line("muted", ""),
        ]),
      };

    case "contact":
      return {
        lines: [
          line("ok", t("terminal.contactTitle")),
          line("out", `  ${t("terminal.email")}     ${profile.email}`),
          line("out", `  ${t("terminal.phone")}     ${profile.phone}`),
          line("out", `  ${t("terminal.linkedin")}  ${profile.linkedin}`),
          line("out", `  ${t("terminal.location")}  ${profile.location}`),
          line("muted", ""),
          line("muted", t("terminal.contactTip")),
        ],
      };

    case "zero-g":
    case "zerog": {
      const next = args[0] === "on" ? true : args[0] === "off" ? false : !ctx.zeroG;
      ctx.setZeroG(next);
      return {
        lines: [
          line("ok", next ? t("terminal.zeroOn") : t("terminal.zeroOff")),
          line(
            "muted",
            next ? t("terminal.zeroOnHint") : t("terminal.zeroOffHint"),
          ),
        ],
      };
    }

    case "clear":
      return { lines: [], clear: true };

    case "exit":
    case "quit":
      return { lines: [line("muted", t("terminal.closing"))], close: true };

    case "date":
      return { lines: [line("out", new Date().toString())] };

    case "echo":
      return { lines: [line("out", args.join(" "))] };

    case "sudo":
      return {
        lines: [line("warn", t("terminal.sudo"))],
      };

    default:
      return {
        lines: [
          line("warn", t("terminal.notFound", { name: name ?? "" })),
          line("muted", t("terminal.unknownHint")),
        ],
      };
  }
}

const kindClass: Record<LineKind, string> = {
  out: "text-foreground/85",
  ok: "text-foreground",
  muted: "text-subtle",
  warn: "text-amber-600 dark:text-amber-300",
  link: "text-tone-mid",
  cmd: "text-foreground",
};

export function DeveloperTerminal() {
  const [open, setOpen] = React.useState(false);
  const { zeroG, setZeroG } = useZeroG();
  const { t } = useI18n();

  // The hero CTA and the ⌘K shortcut both drive the same dialog.
  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };

    window.addEventListener("open-terminal", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-terminal", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={t("terminal.openAria")}
            className="group relative hidden items-center gap-2 rounded-full border border-hairline-strong bg-surface px-3 py-1.5 font-mono text-[0.7rem] tracking-wide text-subtle transition-colors hover:border-hairline-strong hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:inline-flex"
          />
        }
      >
        <TerminalIcon className="size-3.5 text-foreground" aria-hidden="true" />
        <span className="hidden lg:inline">terminal</span>
        <kbd className="ml-1 rounded border border-hairline-strong bg-surface-2 px-1.5 py-0.5 text-[0.62rem] text-subtle">
          ⌘K
        </kbd>
      </DialogTrigger>
      <DialogContent
        className="max-w-[min(52rem,calc(100%-1.5rem))] gap-0 overflow-hidden border-hairline-strong bg-popover p-0 shadow-[0_40px_120px_-40px_var(--glow)] ring-1 ring-hairline backdrop-blur-xl sm:max-w-[min(52rem,calc(100%-1.5rem))]"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{t("terminal.title")}</DialogTitle>
        {open ? (
          <TerminalShell
            zeroG={zeroG}
            setZeroG={setZeroG}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function TerminalShell({
  zeroG,
  setZeroG,
  onClose,
}: {
  zeroG: boolean;
  setZeroG: (v: boolean) => void;
  onClose: () => void;
}) {
  const { t, profile, projects, skillGroups, certifications } = useI18n();
  const [lines, setLines] = React.useState<Line[]>(() => buildGreeting(t));
  const [value, setValue] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (raw: string) => {
    const result = runCommand(raw, {
      setZeroG,
      zeroG,
      t,
      profile,
      projects,
      skillGroups,
      certifications,
    });

    if (raw.trim()) {
      setHistory((prev) => [...prev, raw.trim()]);
    }
    setHistoryIndex(-1);
    setValue("");

    if (result.clear) {
      setLines([]);
      return;
    }

    setLines((prev) => [
      ...prev,
      line("cmd", `firli@portfolio:~$ ${raw.trim()}`),
      ...result.lines,
      line("muted", ""),
    ]);

    if (result.close) {
      window.setTimeout(onClose, 380);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit(value);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const next =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setValue("");
        return;
      }
      setHistoryIndex(next);
      setValue(history[next] ?? "");
      return;
    }

    if (event.key === "Tab") {
      const partial = value.trim().toLowerCase();
      if (!partial) return;
      const match = ASYNC_KEYWORDS.find((keyword) =>
        keyword.startsWith(partial),
      );
      if (match) {
        event.preventDefault();
        setValue(match);
      }
    }
  };

  return (
    <div className="flex h-[min(34rem,72vh)] flex-col font-mono text-[0.8rem] leading-relaxed">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-hairline bg-surface px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <p className="ml-2 truncate text-[0.7rem] text-subtle">
          firli@portfolio — zsh
        </p>
        <div className="ml-auto flex items-center gap-1">
          <span
            className={`mr-1 hidden rounded-full px-2 py-0.5 text-[0.6rem] tracking-wide sm:inline ${
              zeroG
                ? "bg-foreground/10 text-foreground"
                : "bg-surface-2 text-subtle"
            }`}
          >
            {zeroG ? t("terminal.zeroGOn") : t("terminal.zeroGOff")}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("terminal.clearAria")}
            onClick={() => setLines([])}
            className="text-subtle hover:text-foreground"
          >
            <Trash2 />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("terminal.closeAria")}
            onClick={onClose}
            className="text-subtle hover:text-foreground"
          >
            <X />
          </Button>
        </div>
      </div>

      {/* output */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin]"
        role="log"
        aria-live="polite"
        aria-label={t("terminal.outputAria")}
      >
        {lines.map((entry) => (
          <motion.pre
            key={entry.id}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`block font-mono whitespace-pre-wrap ${kindClass[entry.kind]}`}
          >
            {entry.text}
          </motion.pre>
        ))}

        {lines.length === 0 ? (
          <p className="text-subtle">{t("terminal.historyCleared")}</p>
        ) : null}
      </div>

      {/* input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-2 border-t border-hairline bg-surface px-3 py-2.5"
      >
        <label htmlFor="terminal-input" className="text-foreground">
          firli@portfolio:~$
        </label>
        <input
          ref={inputRef}
          id="terminal-input"
          name="terminal-command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("terminal.placeholder")}
          aria-label={t("terminal.inputAria")}
          className="min-w-0 flex-1 bg-transparent text-foreground caret-foreground placeholder:text-faint focus:outline-none"
        />
        <kbd className="hidden items-center gap-1 rounded border border-hairline px-1.5 py-0.5 text-[0.6rem] text-subtle sm:flex">
          <CornerDownLeft className="size-3" aria-hidden="true" /> enter
        </kbd>
      </form>

      <TerminalQuickActions onCommand={submit} />
    </div>
  );
}

function TerminalQuickActions({ onCommand }: { onCommand: (cmd: string) => void }) {
  const commands = ["whoami", "skills", "projects", "contact", "zero-g"];
  const { copied, copy } = useCopy();
  const { profile, t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-hairline bg-surface/60 px-3 py-2">
      <span className="mr-1 text-[0.62rem] tracking-widest text-faint uppercase">
        {t("terminal.quick")}
      </span>
      {commands.map((command) => (
        <button
          key={command}
          type="button"
          onClick={() => onCommand(command)}
          className="rounded-md border border-hairline px-2 py-0.5 text-[0.65rem] text-subtle transition-colors hover:border-hairline-strong hover:text-foreground"
        >
          {command}
        </button>
      ))}
      <button
        type="button"
        onClick={() => copy(profile.email)}
        className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-hairline px-2 py-0.5 text-[0.65rem] text-subtle transition-colors hover:border-hairline-strong hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3" aria-hidden="true" />
        ) : (
          <Copy className="size-3" aria-hidden="true" />
        )}
        {copied ? t("terminal.emailCopied") : t("terminal.copyEmail")}
      </button>
    </div>
  );
}
