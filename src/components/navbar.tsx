import * as React from "react";
import { Link, useLocation } from "react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Orbit, X } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { DeveloperTerminal } from "@/components/developer-terminal";
import { ThemeToggle } from "@/components/theme-toggle";
import { useZeroG } from "@/components/zero-g-provider";
import { navLinks, profile } from "@/lib/content";

export function Navbar() {
  const { zeroG, setZeroG } = useZeroG();
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [elevated, setElevated] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setElevated(latest > 24);
  });

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className={`w-full max-w-6xl rounded-2xl border px-3 py-2 backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 sm:rounded-full sm:px-4 ${
          mobileOpen
            ? "border-hairline-strong bg-background/97"
            : "border-hairline bg-background/80"
        } ${elevated ? "shadow-[0_18px_60px_-32px_var(--glow)] ring-1 ring-hairline" : ""}`}
      >
        <div className="flex items-center gap-2">
          {/* Monogram + availability */}
          <Link
            to="/"
            aria-label="Firli Satriya Putri — back to top"
            className="group flex shrink-0 items-center gap-2.5 rounded-full pr-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="relative grid size-9 place-items-center rounded-xl border border-hairline-strong bg-surface-2 font-mono text-[0.78rem] font-semibold tracking-tight text-foreground transition-colors group-hover:border-foreground/40">
              {profile.monogram}
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[0.8rem] font-semibold text-foreground">
                {profile.shortName}
              </span>
              <span className="mt-1 hidden items-center gap-1.5 text-[0.62rem] text-subtle lg:flex">
                <span
                  className="animate-pulse-ring size-1.5 rounded-full bg-tone-high"
                  aria-hidden="true"
                />
                {profile.availability}
              </span>
            </span>
          </Link>

          {/* Center links */}
          <ul className="mx-auto hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="rounded-full px-3 py-1.5 text-[0.8rem] font-medium text-subtle transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  aria-current={link.href === pathname ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <label
              htmlFor="zero-g-navbar"
              className="group hidden cursor-pointer items-center gap-2 rounded-full border border-hairline bg-surface px-2.5 py-1.5 transition-colors hover:border-hairline-strong hover:bg-surface-2 sm:flex"
            >
              <Orbit
                className={`size-3.5 transition-colors ${
                  zeroG ? "text-foreground" : "text-faint"
                }`}
                aria-hidden="true"
              />
              <span className="text-[0.7rem] font-medium text-subtle">
                Zero-G
              </span>
              <Switch
                id="zero-g-navbar"
                checked={zeroG}
                onCheckedChange={setZeroG}
                aria-label="Toggle zero-gravity physics mode"
                size="sm"
              />
            </label>

            <DeveloperTerminal />

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full border border-hairline bg-surface text-subtle transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:hidden"
            >
              {mobileOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
          >
            <div className="mt-3 border-t border-hairline pt-3 pb-1">
              <ul className="grid gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-subtle transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {link.label}
                      <span className="font-mono text-[0.65rem] text-faint">
                        {link.href}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-hairline bg-surface px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-subtle">
                  <Orbit className="size-4 text-foreground" aria-hidden="true" />
                  Zero-G Mode
                </span>
                <Switch
                  checked={zeroG}
                  onCheckedChange={setZeroG}
                  aria-label="Toggle zero-gravity physics mode"
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-hairline bg-surface px-3 py-2.5">
                <span className="text-sm text-subtle">Theme</span>
                <ThemeToggle />
              </div>

              <p className="mt-2 flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-2 text-[0.68rem] text-subtle">
                <span
                  className="animate-pulse-ring size-1.5 shrink-0 rounded-full bg-tone-high"
                  aria-hidden="true"
                />
                {profile.availability}
              </p>
            </div>
          </motion.div>
        ) : null}
      </motion.nav>
    </header>
  );
}
