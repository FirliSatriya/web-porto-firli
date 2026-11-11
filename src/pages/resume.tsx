import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { PrintButton } from "@/components/print-button";
import {
  certifications,
  profile,
  projects,
  skillGroups,
  systems,
} from "@/lib/content";

export function ResumePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 pt-28 pb-20 sm:pt-32">
      <Button
        variant="ghost"
        size="sm"
        render={<Link to="/" />}
        nativeButton={false}
        className="mb-6 -ml-2 text-subtle hover:text-foreground"
      >
        <ArrowLeft data-icon="inline-start" aria-hidden="true" />
        Back to portfolio
      </Button>

      <article className="resume-sheet glass rounded-3xl p-6 sm:p-9">
        <header className="border-b border-hairline pb-6 print:border-[#d1d5db]">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {profile.name}
            </h1>
            <span className="rounded-full border border-hairline-strong bg-surface-2 px-2.5 py-1 text-[0.65rem] text-foreground">
              {profile.availability}
            </span>
          </div>

          <p className="mt-1 text-[0.86rem] text-tone-mid">{profile.title}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] text-subtle">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3 text-tone-mid" aria-hidden="true" />
              {profile.location}
            </span>
            <span aria-hidden="true">·</span>
            <span>{profile.email}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{profile.phone}</span>

            <span className="flex items-center gap-1.5 pl-1 print:hidden">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="grid size-6 place-items-center rounded-md border border-hairline-strong text-subtle transition-colors hover:text-foreground"
              >
                <LinkedInIcon className="size-3" />
              </a>
              <a
                href="https://github.com/FirliSatriya"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="grid size-6 place-items-center rounded-md border border-hairline-strong text-subtle transition-colors hover:text-foreground"
              >
                <GitHubIcon className="size-3" />
              </a>
            </span>
          </div>

          <p className="mt-4 text-[0.82rem] leading-relaxed text-pretty text-subtle">
            {profile.bio}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 print:hidden">
            <PrintButton />
            <Button
              size="sm"
              variant="outline"
              render={<a href={`mailto:${profile.email}`} />}
              nativeButton={false}
              className="border-hairline-strong"
            >
              Email me
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </header>

        <Section title="Experience & Projects">
          <ul className="grid gap-4">
            {projects.map((project) => (
              <li key={project.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h3 className="text-[0.88rem] font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <span className="font-mono text-[0.65rem] text-subtle">
                    {project.year}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.7rem] text-tone-mid">
                  {project.org} · {project.role}
                </p>
                <p className="mt-1.5 text-[0.78rem] leading-relaxed text-subtle">
                  {project.summary}
                </p>
                <p className="mt-1.5 font-mono text-[0.65rem] text-faint">
                  {project.stack.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Skills">
          <dl className="grid gap-2.5">
            {skillGroups.map((group) => (
              <div key={group.id} className="grid grid-cols-1 gap-0.5 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <dt className="text-[0.74rem] font-medium text-foreground">
                  {group.label}
                </dt>
                <dd className="text-[0.74rem] text-subtle">
                  {group.skills.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Method">
          <ul className="grid gap-2">
            {systems.map((system) => (
              <li
                key={system.title}
                className="text-[0.78rem] leading-relaxed text-subtle"
              >
                <span className="font-medium text-foreground">
                  {system.title}
                </span>{" "}
                — {system.detail}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Credentials">
          <ul className="grid gap-2">
            {certifications.map((cert) => (
              <li key={cert.name} className="text-[0.78rem] text-subtle">
                <span className="font-medium text-foreground">{cert.name}</span>
                <span className="text-faint"> · </span>
                {cert.issuer}
                <span className="text-faint"> · </span>
                <span className="font-mono text-[0.7rem] text-tone-mid">
                  {cert.period}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 border-t border-hairline pt-5 first-of-type:border-t-0 print:border-[#d1d5db]">
      <h2 className="font-mono text-[0.62rem] tracking-[0.18em] text-subtle uppercase">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
