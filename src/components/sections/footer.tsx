import { Link } from "react-router";
import { ArrowUpRight, MapPin } from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { navLinks, profile } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg border border-foreground/25 bg-foreground/[0.07] font-mono text-[0.7rem] font-semibold text-foreground">
                {profile.monogram}
              </span>
              <div>
                <p className="text-[0.85rem] font-semibold text-foreground">
                  {profile.name}
                </p>
                <p className="font-mono text-[0.62rem] text-subtle">
                  {profile.credential} · {profile.university}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[0.76rem] leading-relaxed text-subtle">
              Front-End, UI/UX and data-driven systems. Built with React and
              Tailwind CSS.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[0.78rem] text-subtle transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className="text-[0.78rem] text-subtle transition-colors hover:text-foreground"
            >
              Email
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[0.78rem] text-subtle transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </nav>

          <div className="flex flex-col gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-1.5 text-[0.78rem] text-foreground transition-colors hover:text-tone-mid"
            >
              {profile.email}
              <ArrowUpRight
                className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href={`tel:${profile.phoneHref}`}
              className="font-mono text-[0.74rem] text-subtle transition-colors hover:text-foreground"
            >
              {profile.phone}
            </a>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[0.72rem] text-subtle">
              <MapPin className="size-3 text-tone-mid" aria-hidden="true" />
              {profile.location}
            </p>

            <div className="mt-2 flex items-center gap-1.5">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="grid size-8 place-items-center rounded-lg border border-hairline bg-surface text-subtle transition-colors hover:border-hairline-strong hover:text-foreground"
              >
                <LinkedInIcon className="size-3.5" />
              </a>
              <a
                href="https://github.com/FirliSatriya"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile"
                className="grid size-8 place-items-center rounded-lg border border-hairline bg-surface text-subtle transition-colors hover:border-hairline-strong hover:text-foreground"
              >
                <GitHubIcon className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] text-faint">
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.65rem] text-faint">
            React · React Router · Tailwind CSS · Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
