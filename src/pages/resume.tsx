import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { PrintButton } from "@/components/print-button";
import { useI18n, type LocalizedProject } from "@/i18n";

export function ResumePage() {
  const { certifications, committees, profile, projects, skillGroups, t } =
    useI18n();

  // Internships read as roles; self-directed builds read as projects. Both come
  // from the same project list so the résumé can never drift from the portfolio.
  const experience = projects
    .filter((project) => project.resume.section === "experience")
    .sort(byPeriodDesc);
  const selectedProjects = projects
    .filter((project) => project.resume.section === "project")
    .sort(byPeriodDesc);

  // The degree is rendered under Education, where it belongs. Its entry carries
  // the "S.Tr.Kom." marker instead of a date, so it is filtered on that.
  const credentials = certifications.filter(
    (cert) => cert.period !== "S.Tr.Kom.",
  );

  return (
    <main
      id="content"
      className="mx-auto w-full max-w-3xl px-5 pt-28 pb-20 sm:pt-32"
    >
      <Button
        variant="ghost"
        size="sm"
        render={<Link to="/" />}
        nativeButton={false}
        className="mb-6 -ml-2 text-subtle hover:text-foreground"
      >
        <ArrowLeft data-icon="inline-start" aria-hidden="true" />
        {t("common.backToPortfolio")}
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

          <p className="mt-1 text-[0.86rem] text-tone-mid">
            {profile.resumeTitle}
          </p>

          {/* Links print as plain text: an icon-only contact row is useless on
              paper, so the URLs stay visible and only the glyphs drop out. */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] text-subtle">
            <span className="inline-flex items-center gap-1">
              <MapPin
                className="size-3 text-tone-mid print:hidden"
                aria-hidden="true"
              />
              {profile.location}
            </span>
            <Dot />
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-foreground"
            >
              {profile.email}
            </a>
            <Dot />
            <a
              href={`tel:${profile.phoneHref}`}
              className="font-mono transition-colors hover:text-foreground"
            >
              {profile.phone}
            </a>
            <Dot />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <LinkedInIcon className="size-3 print:hidden" />
              {profile.linkedinLabel}
            </a>
            <Dot />
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-3 print:hidden" />
              {profile.githubLabel}
            </a>
          </div>

          <p className="mt-4 text-[0.82rem] leading-relaxed text-pretty text-subtle">
            {profile.summary}
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
              {t("common.emailMe")}
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </header>

        <Section title={t("resume.experience")}>
          <ul className="grid gap-4">
            {experience.map((project) => (
              <Entry key={project.slug} project={project} lead="org" showStack />
            ))}
          </ul>
        </Section>

        <Section title={t("resume.projects")}>
          <ul className="grid gap-4">
            {selectedProjects.map((project) => (
              <Entry key={project.slug} project={project} lead="title" />
            ))}
          </ul>
        </Section>

        <Section title={t("resume.education")}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <h3 className="text-[0.88rem] font-semibold text-foreground">
              {profile.university}
            </h3>
            <span className="font-mono text-[0.65rem] text-subtle">
              {profile.educationPeriod}
            </span>
          </div>
          <p className="mt-0.5 text-[0.78rem] text-subtle">
            {profile.degree}
            <span className="text-faint"> · </span>
            <span className="font-mono text-[0.7rem] text-tone-mid">
              {profile.credential}
            </span>
            <span className="text-faint"> · </span>
            {t("resume.gpa")} {profile.gpa}
          </p>
        </Section>

        <Section title={t("resume.committees")}>
          <ul className="grid gap-3">
            {committees.map((entry) => (
              <li key={`${entry.org}-${entry.title}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <h3 className="text-[0.86rem] font-semibold text-foreground">
                    {entry.title}
                  </h3>
                  <span className="font-mono text-[0.65rem] text-subtle">
                    {entry.period}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.72rem] text-tone-mid">
                  {entry.org}
                </p>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-subtle">
                  {entry.detail}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t("resume.skills")}>
          <dl className="grid gap-2.5">
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="grid grid-cols-1 gap-0.5 sm:grid-cols-[8rem_minmax(0,1fr)]"
              >
                <dt className="text-[0.74rem] font-medium text-foreground">
                  {group.label}
                </dt>
                <dd className="text-[0.74rem] text-subtle">
                  {group.skills.join(", ")}
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-[0.74rem] font-medium text-foreground">
                {t("resume.languages")}
              </dt>
              <dd className="text-[0.74rem] text-subtle">
                {profile.languages.join(", ")}
              </dd>
            </div>
          </dl>
        </Section>

        <Section title={t("resume.credentials")}>
          <ul className="grid gap-2">
            {credentials.map((cert) => (
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

/** Résumés read newest-first; periods are display strings, so pull the year out. */
function periodYear(period: string) {
  const years = period.match(/\d{4}/g);
  return years ? Number(years[years.length - 1]) : 0;
}

function byPeriodDesc(a: LocalizedProject, b: LocalizedProject) {
  return periodYear(b.resume.period) - periodYear(a.resume.period);
}

function Entry({
  project,
  lead,
  showStack = false,
}: {
  project: LocalizedProject;
  /** Which line carries the weight: the employer (roles) or the build (projects). */
  lead: "org" | "title";
  showStack?: boolean;
}) {
  const heading = lead === "org" ? project.org : project.title;
  // Telkom's project title is its role plus "- Internship", so printing the
  // title would repeat the role. Only add it back when it carries new words.
  const subheading =
    lead === "title"
      ? project.title.startsWith(project.org)
        ? project.role
        : `${project.org} · ${project.role}`
      : project.title.startsWith(project.role)
        ? project.role
        : `${project.title} · ${project.role}`;

  return (
    <li>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h3 className="text-[0.88rem] font-semibold text-foreground">
          {heading}
        </h3>
        <span className="font-mono text-[0.65rem] text-subtle">
          {project.resume.period}
        </span>
      </div>
      <p className="mt-0.5 text-[0.72rem] text-tone-mid">{subheading}</p>
      <ul className="mt-1.5 grid list-disc gap-1 pl-4 text-[0.78rem] leading-relaxed text-subtle marker:text-faint">
        {project.resume.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {showStack ? (
        <p className="mt-1.5 font-mono text-[0.65rem] text-faint">
          {project.stack.join(" · ")}
        </p>
      ) : null}
    </li>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="text-faint">
      ·
    </span>
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
