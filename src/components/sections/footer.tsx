import { Link } from "react-router";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { navLinks, profile } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-hairline">
      <div className="mx-auto w-full max-w-6xl px-5 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-foreground/25 bg-foreground/[0.07] font-mono text-[0.7rem] font-semibold text-foreground">
              {profile.monogram}
            </span>
            <div>
              <p className="text-[0.8rem] font-semibold text-foreground">
                {profile.name}
              </p>
              <p className="font-mono text-[0.6rem] text-subtle">
                {profile.credential} · {profile.university}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center gap-x-4 gap-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[0.72rem] text-subtle transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <span
              className="hidden h-3 w-px bg-hairline-strong sm:block"
              aria-hidden="true"
            />

            <div className="flex items-center gap-1.5">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="grid size-7 place-items-center rounded-lg border border-hairline bg-surface text-subtle transition-colors hover:border-hairline-strong hover:text-foreground"
              >
                <LinkedInIcon className="size-3.5" />
              </a>
              <a
                href="https://github.com/FirliSatriya"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile"
                className="grid size-7 place-items-center rounded-lg border border-hairline bg-surface text-subtle transition-colors hover:border-hairline-strong hover:text-foreground"
              >
                <GitHubIcon className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[0.62rem] text-faint">
          © {year} firelle.my.id
        </p>
      </div>
    </footer>
  );
}
