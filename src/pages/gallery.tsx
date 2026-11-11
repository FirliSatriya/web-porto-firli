import { Link } from "react-router";
import { ArrowLeft, Images } from "lucide-react";

import { Section } from "@/components/section";
import { Gallery } from "@/components/sections/gallery";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/sections/footer";
import { gallery } from "@/lib/gallery";

export function GalleryPage() {
  return (
    <>
      <main id="content" className="relative flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-5 pt-28 sm:pt-32">
          <Button
            variant="ghost"
            size="sm"
            render={<Link to="/" />}
            nativeButton={false}
            className="-ml-2 text-subtle hover:text-foreground"
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Back to portfolio
          </Button>

          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.18em] text-subtle uppercase">
            <Images className="size-3" aria-hidden="true" />
            {String(gallery.length).padStart(2, "0")} frames
          </span>
        </div>

        <Section
          id="gallery"
          className="-mt-6"
          eyebrow="Visual records"
          title={
            <>
              Studies, screens and
              <span className="text-gradient-ink"> side experiments</span>
            </>
          }
          description="Interface drafts, design-system sheets and data visuals from the daily practice. Nothing here carries a client metric — just the frames worth keeping."
        >
          <Gallery />
        </Section>
      </main>

      <Footer />
    </>
  );
}
