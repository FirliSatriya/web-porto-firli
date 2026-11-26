import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export function PrintButton() {
  const { t } = useI18n();

  return (
    <Button
      size="sm"
      onClick={() => window.print()}
      className="bg-primary text-primary-foreground hover:opacity-90"
    >
      <Download data-icon="inline-start" aria-hidden="true" />
      {t("common.printSave")}
    </Button>
  );
}
