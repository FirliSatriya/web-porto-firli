import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { SkillsArena } from "@/components/sections/skills-arena";
import { Systems } from "@/components/sections/systems";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Section } from "@/components/section";
import { useI18n } from "@/i18n";

export function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <main id="content" className="relative flex-1">
        <Hero />

        <Section
          id="works"
          eyebrow={t("home.worksEyebrow")}
          title={
            <>
              {t("home.worksTitleLead")}
              <span className="text-gradient-ink">
                {t("home.worksTitleAccent")}
              </span>
            </>
          }
          description={t("home.worksDesc")}
        >
          <Projects />
        </Section>

        <Section
          id="systems"
          eyebrow={t("home.systemsEyebrow")}
          title={t("home.systemsTitle")}
          description={t("home.systemsDesc")}
        >
          <Systems />
        </Section>

        <Section
          id="skills"
          eyebrow={t("home.skillsEyebrow")}
          title={t("home.skillsTitle")}
          description={t("home.skillsDesc")}
        >
          <SkillsArena />
        </Section>

        <Section
          id="contact"
          eyebrow={t("home.contactEyebrow")}
          title={t("home.contactTitle")}
          description={t("home.contactDesc")}
        >
          <Contact />
        </Section>
      </main>

      <Footer />
    </>
  );
}
