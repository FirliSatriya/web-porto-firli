import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      size="sm"
      onClick={() => window.print()}
      className="bg-primary text-primary-foreground hover:opacity-90"
    >
      <Download data-icon="inline-start" aria-hidden="true" />
      Print / Save as PDF
    </Button>
  );
}
