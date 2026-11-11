import * as React from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "firli-theme";
const CHANGE_EVENT = "firli-theme-change";

/**
 * Runs before hydration so the stored theme lands on <html> before first paint.
 * Kept as a string so it can be inlined in a blocking <script> tag.
 */
export const themeBootScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=s==="dark"||(s!=="light"&&m);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

/* ---------------------------------------------------------------------------
 * A tiny external store owns the preference. React subscribes to it with
 * useSyncExternalStore, so the theme never has to be copied into state from an
 * effect and there is no cascading render on mount.
 * ------------------------------------------------------------------------- */

const listeners = new Set<() => void>();

function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function readResolved(): ResolvedTheme {
  const preference = readPreference();
  return preference === "system" ? systemTheme() : preference;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (readPreference() === "system") emit();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) emit();
  };

  query.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, listener);

  return () => {
    listeners.delete(listener);
    query.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

function getServerSnapshot(): ResolvedTheme {
  return "dark";
}

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme;
  setTheme: (value: ThemePreference) => void;
  toggle: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = React.useSyncExternalStore(
    subscribe,
    readResolved,
    getServerSnapshot,
  );

  // Mirror the resolved theme onto <html> â€” the one external system that needs
  // updating. The boot script has already applied it before first paint.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = React.useCallback((value: ThemePreference) => {
    try {
      if (value === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private mode or blocked storage: still apply for this tab.
    }
    emit();
  }, []);

  const toggle = React.useCallback(() => {
    setTheme(readResolved() === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = React.useMemo(
    () => ({ resolvedTheme, setTheme, toggle }),
    [resolvedTheme, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
