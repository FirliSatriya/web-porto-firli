import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { SkillsArena } from "@/components/sections/skills-arena";
import { Systems } from "@/components/sections/systems";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Section } from "@/components/section";

export function HomePage() {
  return (
    <>
      <main id="content" className="relative flex-1">
        <Hero />

        <Section
          id="works"
          eyebrow="Flagship work"
          title={
            <>
              Systems shipped for real
              <span className="text-gradient-ink"> constraints</span>
            </>
          }
          description="Four builds spanning decision-support algorithms, online storefronts, point-of-sale operations and real-time WebRTC media. Each one carries a measurable outcome, not just a screenshot."
        >
          <Projects />
        </Section>

        <Section
          id="systems"
          eyebrow="How I work"
          title="Reusable systems, not one-off screens"
          description="The patterns that repeat across the four builds: an auditable ranking pipeline, a three-step buying path, store operations that keep transactions in one place, and a synchronised real-time capture stack."
        >
          <Systems />
        </Section>

        <Section
          id="skills"
          eyebrow="Zero-gravity skills arena"
          title="Drag, fling, or switch off gravity"
          description="Every skill in the brief becomes a physical object here. Toggle Zero-G so they drift forever, or switch it off and watch them settle. Filter by discipline to isolate a stack."
        >
          <SkillsArena />
        </Section>

        <Section
          id="contact"
          eyebrow="Contact"
          title="One click away from a conversation"
          description="Email and phone are one click from a copy or a call — and the terminal in the header understands `contact` too."
        >
          <Contact />
        </Section>
      </main>

      <Footer />
    </>
  );
}
