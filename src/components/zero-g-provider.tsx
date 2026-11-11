import * as React from "react";

/**
 * Zero-G is a single, global physics preference: the navbar switch and the
 * skills arena toggle both read and write it, so they can never disagree.
 */
type ZeroGContextValue = {
  zeroG: boolean;
  setZeroG: (value: boolean) => void;
  toggle: () => void;
  reducedMotion: boolean;
};

const ZeroGContext = React.createContext<ZeroGContextValue | null>(null);

export function ZeroGProvider({ children }: { children: React.ReactNode }) {
  const [zeroG, setZeroG] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const toggle = React.useCallback(() => setZeroG((v) => !v), []);

  const value = React.useMemo(
    () => ({ zeroG, setZeroG, toggle, reducedMotion }),
    [zeroG, toggle, reducedMotion],
  );

  return <ZeroGContext.Provider value={value}>{children}</ZeroGContext.Provider>;
}

export function useZeroG() {
  const ctx = React.useContext(ZeroGContext);
  if (!ctx) {
    throw new Error("useZeroG must be used inside <ZeroGProvider>");
  }
  return ctx;
}
