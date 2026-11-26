import * as React from "react";
import { Outlet, useLocation } from "react-router";

import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ZeroGProvider } from "@/components/zero-g-provider";
import { VoidBackground } from "@/components/void-background";
import { I18nProvider, useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";

/**
 * Document metadata used to live in per-route `metadata` exports. There is no
 * server here, so each route reports its own title/description and the shell
 * applies it after navigation. The strings themselves are language-aware.
 */
const PAGE_META_KEYS: Record<
  string,
  { title: MessageKey; description: MessageKey }
> = {
  "/": { title: "meta.home.title", description: "meta.home.desc" },
  "/gallery": { title: "meta.gallery.title", description: "meta.gallery.desc" },
  "/resume": { title: "meta.resume.title", description: "meta.resume.desc" },
};

export function SiteLayout() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <ZeroGProvider>
          <SiteShell />
        </ZeroGProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

function SiteShell() {
  const location = useLocation();
  const { pathname, hash, key } = location;
  const { t, lang } = useI18n();

  React.useEffect(() => {
    const meta = PAGE_META_KEYS[pathname] ?? PAGE_META_KEYS["/"];
    document.title = t(meta.title);

    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = t(meta.description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${pathname === "/" ? "" : pathname}`;
  }, [pathname, t, lang]);

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
    <>
      <VoidBackground />
      <a
        href="#content"
        className="sr-only rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        {t("common.skipToContent")}
      </a>
      <Navbar />
      <Outlet />
    </>
  );
}
