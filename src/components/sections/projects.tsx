import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Layers,
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projects, type Project, type Tone } from "@/lib/content";

const TONE_GLOW: Record<Tone, string> = {
  high: "shadow-[0_0_60px_-30px_var(--glow)]",
  mid: "shadow-[0_0_60px_-34px_var(--glow-soft)]",
  low: "shadow-none",
};

const TONE_TEXT: Record<Tone, string> = {
  high: "text-foreground",
  mid: "text-tone-mid",
  low: "text-subtle",
};

const TONE_LINE: Record<Tone, string> = {
  high: "from-foreground/70",
  mid: "from-foreground/35",
  low: "from-foreground/15",
};

const FILTERS = [
  { value: "all", label: "All work" },
  { value: "flagship", label: "Flagship" },
  { value: "frontend", label: "Front-End & UI/UX" },
  { value: "data", label: "Data & Algorithms" },
  { value: "commerce", label: "Commerce" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

function matchesFilter(project: Project, filter: FilterValue) {
  if (filter === "all") return true;
  if (filter === "flagship") return project.flagship === true;
  if (filter === "commerce") return project.tags.includes("E-Commerce");
  if (filter === "data") return project.tags.includes("MCDM") || project.tags.includes("OCR QC");
  return (
    project.tags.includes("Internal Tool") ||
    project.tags.includes("Design System") ||
    project.role.includes("UI/UX")
  );
}

export function Projects() {
  const [filter, setFilter] = React.useState<FilterValue>("all");
  const [density, setDensity] = React.useState<"comfortable" | "compact">(
    "comfortable",
  );

  const visible = React.useMemo(
    () => projects.filter((project) => matchesFilter(project, filter)),
    [filter],
  );

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.64rem] tracking-[0.16em] text-faint uppercase">
            <SlidersHorizontal className="size-3" aria-hidden="true" />
            filter
          </span>

          <Select
            items={FILTERS}
            value={filter}
            onValueChange={(value) => {
              if (value) setFilter(value as FilterValue);
            }}
          >
            <SelectTrigger
              className="h-8 w-[11.5rem] border-hairline-strong bg-surface text-[0.75rem] text-foreground"
              aria-label="Filter projects by discipline"
            >
              <SelectValue placeholder="All work" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="border-hairline bg-popover">
              <SelectGroup>
                {FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <span className="font-mono text-[0.65rem] text-faint">
            {visible.length} / {projects.length}
          </span>
        </div>

        <ButtonGroup aria-label="Card density">
          <Button
            size="sm"
            variant={density === "comfortable" ? "secondary" : "ghost"}
            onClick={() => setDensity("comfortable")}
            aria-pressed={density === "comfortable"}
            className="text-[0.7rem]"
          >
            <LayoutGrid data-icon="inline-start" aria-hidden="true" />
            Bento
          </Button>
          <Button
            size="sm"
            variant={density === "compact" ? "secondary" : "ghost"}
            onClick={() => setDensity("compact")}
            aria-pressed={density === "compact"}
            className="text-[0.7rem]"
          >
            <Rows3 data-icon="inline-start" aria-hidden="true" />
            Rows
          </Button>
        </ButtonGroup>
      </div>

      <motion.div
        layout
        className={
          density === "comfortable"
            ? "mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "mt-5 grid grid-cols-1 gap-3"
        }
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              density={density}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {!visible.length ? (
        <p className="mt-8 rounded-2xl border border-hairline bg-surface px-4 py-8 text-center text-sm text-subtle">
          Nothing under this filter yet — try “All work”.
        </p>
      ) : null}
    </div>
  );
}

function ProjectCard({
  project,
  density,
}: {
  project: Project;
  density: "comfortable" | "compact";
}) {
  const flagship = project.flagship && density === "comfortable";
  const live = Boolean(project.liveUrl);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden panel rounded-2xl transition-colors duration-300 ${
        live ? "hover:border-hairline-strong focus-within:border-hairline-strong" : "hover:border-hairline-strong"
      } ${TONE_GLOW[project.tone]} ${
        flagship ? "md:col-span-2 lg:col-span-2" : ""
      } ${density === "compact" ? "sm:flex-row sm:items-center sm:gap-5" : ""}`}
    >
      {live ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open the live ${project.title} build (opens in a new tab)`}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
      ) : null}

      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent ${TONE_LINE[project.tone]}`}
      />

      <div
        className={`relative flex flex-1 flex-col p-5 ${density === "compact" ? "sm:p-4" : ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[0.62rem] tracking-[0.18em] ${TONE_TEXT[project.tone]}`}
              >
                {project.index}
              </span>
              {project.flagship ? (
                <Badge
                  variant="outline"
                  className="h-5 border-foreground/30 bg-foreground/[0.07] px-1.5 text-[0.58rem] tracking-wide text-foreground"
                >
                  <Layers className="size-2.5" aria-hidden="true" />
                  Flagship
                </Badge>
              ) : null}
            </div>

            <h3
              className={`mt-2 font-semibold tracking-[-0.01em] text-balance text-foreground ${
                flagship ? "text-xl sm:text-[1.35rem]" : "text-[0.98rem]"
              }`}
            >
              {project.title}
            </h3>

            <p className="mt-1 text-[0.7rem] text-subtle">
              {project.org} · {project.role}
            </p>
          </div>

          {live ? (
            <span
              className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-hairline bg-surface ${TONE_TEXT[project.tone]} transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-within:-translate-y-0.5 group-focus-within:translate-x-0.5`}
              aria-hidden="true"
            >
              <ArrowUpRight className="size-4" />
            </span>
          ) : null}
        </div>

        <p
          className={`mt-3 text-[0.82rem] leading-relaxed text-pretty text-subtle ${
            flagship ? "sm:text-[0.88rem]" : ""
          } ${density === "compact" ? "line-clamp-2" : ""}`}
        >
          {density === "compact" ? project.tagline : project.summary}
        </p>

        {density === "comfortable" ? (
          <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-hairline pt-3">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-[0.56rem] tracking-[0.1em] text-faint uppercase">
                  {metric.label}
                </dt>
                <dd
                  className={`mt-0.5 font-mono text-[0.72rem] ${TONE_TEXT[project.tone]}`}
                >
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {project.stack.slice(0, density === "compact" ? 2 : 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[0.6rem] text-subtle"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > (density === "compact" ? 2 : 4) ? (
            <span className="font-mono text-[0.6rem] text-faint">
              +{project.stack.length - (density === "compact" ? 2 : 4)}
            </span>
          ) : null}

          {live ? (
            <span className="ml-auto inline-flex items-center gap-1 font-mono text-[0.6rem] text-subtle transition-colors group-hover:text-foreground">
              Live demo
              <ArrowUpRight className="size-2.5" aria-hidden="true" />
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
