import * as React from "react";
import { Outlet, useLocation } from "react-router";

import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ZeroGProvider } from "@/components/zero-g-provider";
import { VoidBackground } from "@/components/void-background";

/**
 * Document metadata used to live in per-route `metadata` exports. There is no
 * server here, so each route reports its own title/description and the shell
 * applies it after navigation.
 */
const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Firli Satriya Putri — Applied Informatics Engineer",
    description:
      "Portfolio of Firli Satriya Putri — Applied Informatics Engineer, UI/UX practitioner and BNSP-certified data scientist building data-driven web systems.",
  },
  "/gallery": {
    title: "Gallery · Firli Satriya Putri",
    description:
      "A wall of interface studies, design-system sheets and data visuals — the frames that never became a case study.",
  },
  "/resume": {
    title: "Résumé · Firli Satriya Putri",
    description:
      "Curriculum vitae for Firli Satriya Putri — Applied Informatics Engineer & BNSP Certified Associate Data Scientist.",
  },
};

export function SiteLayout() {
  const location = useLocation();
  const { pathname, hash, key } = location;

  React.useEffect(() => {
    const meta = PAGE_META[pathname] ?? PAGE_META["/"];
    document.title = meta.title;

    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = meta.description;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${pathname === "/" ? "" : pathname}`;
  }, [pathname]);

  // React Router does not scroll for us. Cross-route links like "/#works" need
  // the target section to exist first, so the lookup waits one frame.
  const renderedPath = React.useRef(pathname);
  React.useEffect(() => {
    if (!hash) {
      // A new route without a hash starts at the top; re-running a hash-less
      // navigation on the same route must not yank the page upward.
      if (renderedPath.current !== pathname) {
        renderedPath.current = pathname;
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      return;
    }

    renderedPath.current = pathname;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return (
    <ThemeProvider>
      <ZeroGProvider>
        <VoidBackground />
        <a
          href="#content"
          className="sr-only rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>
        <Navbar />
        <Outlet />
      </ZeroGProvider>
    </ThemeProvider>
  );
}
