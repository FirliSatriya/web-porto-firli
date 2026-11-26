import { Globe } from "lucide-react";

import { useI18n } from "@/i18n";

/**
 * Shows the active language code; clicking swaps EN ⇄ ID. The label announces
 * the destination language so screen readers hear an action, not a state.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang, t } = useI18n();
  const label =
    lang === "en" ? t("common.switchToIndonesian") : t("common.switchToEnglish");

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 font-mono text-[0.64rem] font-semibold tracking-wide text-subtle transition-colors hover:border-hairline-strong hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`}
    >
      <Globe className="size-3.5" aria-hidden="true" />
      {lang.toUpperCase()}
    </button>
  );
}
