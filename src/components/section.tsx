import * as React from "react";
import { motion } from "motion/react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl px-5 py-14 sm:py-18 ${className ?? ""}`}
    >
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl"
      >
        <p className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-subtle uppercase">
          <span className="h-px w-6 bg-foreground/40" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-[0.86rem] leading-relaxed text-pretty text-subtle">
            {description}
          </p>
        ) : null}
      </motion.header>

      {children}
    </section>
  );
}
