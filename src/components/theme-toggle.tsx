import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";

/**
 * Light/dark switch. Both icons are always rendered and swapped with the `dark`
 * variant instead of state, so the markup matches whichever theme the boot
 * script painted — no icon flicker on mount.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      className={`relative grid size-9 shrink-0 place-items-center rounded-full border border-hairline bg-surface text-subtle transition-colors hover:border-hairline-strong hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`}
    >
      <span className="grid size-4 place-items-center">
        <Sun
          aria-hidden="true"
          className="col-start-1 row-start-1 size-4 transition-all duration-300 dark:scale-0 dark:-rotate-90 dark:opacity-0"
        />
        <Moon
          aria-hidden="true"
          className="col-start-1 row-start-1 size-4 scale-0 rotate-90 opacity-0 transition-all duration-300 dark:scale-100 dark:rotate-0 dark:opacity-100"
        />
      </span>
    </button>
  );
}
