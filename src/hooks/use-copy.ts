import * as React from "react";

type CopyState = "idle" | "copied" | "error";

/**
 * Clipboard writes need a fallback: navigator.clipboard is unavailable on
 * insecure origins, which is common when previewing a dev build over LAN.
 */
export function useCopy(resetAfter = 1800) {
  const [state, setState] = React.useState<CopyState>("idle");
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const copy = React.useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          document.body.removeChild(area);
        }

        setState("copied");
      } catch {
        setState("error");
      }

      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setState("idle"), resetAfter);
    },
    [resetAfter],
  );

  return { state, copy, copied: state === "copied" };
}
