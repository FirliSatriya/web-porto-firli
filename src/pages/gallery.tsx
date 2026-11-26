import { Link } from "react-router";
import { ArrowLeft, Images } from "lucide-react";

import { Section } from "@/components/section";
import { Gallery } from "@/components/sections/gallery";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/sections/footer";
import { useI18n } from "@/i18n";

export function GalleryPage() {
  const { gallery, t } = useI18n();

  return (
    <>
      <main id="content" className="relative flex-1">
        {/* The section below is pulled up with a negative margin, so this bar
            needs its own stacking context to stay above it and keep the link
            clickable. */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-5 pt-28 sm:pt-32">
          <Button
            variant="ghost"
            size="sm"
            render={<Link to="/" />}
            nativeButton={false}
            className="-ml-2 text-subtle hover:text-foreground"
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            {t("common.backToPortfolio")}
          </Button>

          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.18em] text-subtle uppercase">
            <Images className="size-3" aria-hidden="true" />
            {String(gallery.length).padStart(2, "0")}{" "}
            {t("galleryPage.frames")}
          </span>
        </div>

        <Section
          id="gallery"
          className="-mt-6"
          eyebrow={t("galleryPage.eyebrow")}
          title={
            <>
              {t("galleryPage.titleLead")}
              <span className="text-gradient-ink">
                {t("galleryPage.titleAccent")}
              </span>
            </>
          }
          description={t("galleryPage.desc")}
        >
          <Gallery />
        </Section>
      </main>

      <Footer />
    </>
  );
}
