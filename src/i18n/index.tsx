import * as React from "react";

import {
  certifications as certificationsSource,
  navLinks as navLinksSource,
  profile as profileSource,
  projects as projectsSource,
  skillGroups as skillGroupsSource,
  systems as systemsSource,
  type Project,
  type SkillGroupId,
  type Tone,
} from "@/lib/content";
import {
  gallery as gallerySource,
  type GalleryItem,
} from "@/lib/gallery";
import {
  certificationCopyId,
  galleryCopyId,
  navLabelsId,
  pipelineStepsId,
  profileId,
  projectCopyId,
  skillGroupCopyId,
  systemCopyId,
} from "./content-id";
import { en, id as idMessages, type MessageKey } from "./messages";

export type Lang = "en" | "id";

export type ProfileContent = {
  name: string;
  shortName: string;
  monogram: string;
  credential: string;
  title: string;
  availability: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  phoneHref: string;
  linkedin: string;
  linkedinLabel: string;
  location: string;
  university: string;
  degree: string;
};

export type NavLinkContent = { label: string; href: string };

export type SkillGroupContent = {
  id: SkillGroupId;
  label: string;
  tone: Tone;
  blurb: string;
  skills: string[];
};

export type SystemContent = {
  title: string;
  detail: string;
  tone: Tone;
  icon: string;
};

export type CertificationContent = {
  name: string;
  issuer: string;
  period: string;
  tone: Tone;
};

export type ProjectFilterKey = "flagship" | "frontend" | "data" | "store";

export type LocalizedProject = Project & { filterKeys: ProjectFilterKey[] };

export type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  profile: ProfileContent;
  navLinks: NavLinkContent[];
  projects: LocalizedProject[];
  skillGroups: SkillGroupContent[];
  systems: SystemContent[];
  certifications: CertificationContent[];
  gallery: GalleryItem[];
  pipelineSteps: string[];
};

const STORAGE_KEY = "firli-lang";

function readInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "id") return saved;
    if (navigator.language?.toLowerCase().startsWith("id")) return "id";
  } catch {
    // Storage can be blocked; the default below is still valid.
  }
  return "en";
}

/** Derived from the English source so filters survive translation. */
function projectFilterKeys(project: Project): ProjectFilterKey[] {
  const keys: ProjectFilterKey[] = [];
  if (project.flagship) keys.push("flagship");
  if (
    project.tags.some((tag) =>
      ["Store", "POS", "Retail Operations"].includes(tag),
    )
  ) {
    keys.push("store");
  }
  if (
    project.tags.some((tag) =>
      [
        "MCDM",
        "AHP",
        "SAW",
        "Data Science",
        "Data Quality",
        "Model QA",
      ].includes(tag),
    )
  ) {
    keys.push("data");
  }
  if (
    project.role.includes("Front-End") ||
    project.role.includes("UI/UX")
  ) {
    keys.push("frontend");
  }
  return keys;
}

function buildContent(lang: Lang) {
  const isId = lang === "id";

  const profile: ProfileContent = isId
    ? { ...profileSource, ...profileId }
    : { ...profileSource };

  const navLinks: NavLinkContent[] = navLinksSource.map((link) => ({
    href: link.href,
    label: (isId ? navLabelsId[link.href] : undefined) ?? link.label,
  }));

  const projects: LocalizedProject[] = projectsSource.map((project) => {
    const copy = isId ? projectCopyId[project.slug] : undefined;
    const cover = project.cover
      ? { ...project.cover, alt: copy?.coverAlt ?? project.cover.alt }
      : undefined;

    return {
      ...project,
      ...(copy
        ? {
            title: copy.title,
            org: copy.org,
            tagline: copy.tagline,
            summary: copy.summary,
            role: copy.role,
            metrics: copy.metrics,
          }
        : {}),
      cover,
      filterKeys: projectFilterKeys(project),
    };
  });

  const skillGroups: SkillGroupContent[] = skillGroupsSource.map((group) => {
    const copy = isId ? skillGroupCopyId[group.id] : undefined;
    return copy ? { ...group, ...copy } : { ...group };
  });

  const systems: SystemContent[] = systemsSource.map((system) => {
    const copy = isId ? systemCopyId[system.icon] : undefined;
    return copy ? { ...system, ...copy } : { ...system };
  });

  const certifications: CertificationContent[] = certificationsSource.map(
    (cert, index) => {
      const copy = isId ? certificationCopyId[index] : undefined;
      return copy ? { ...cert, ...copy } : { ...cert };
    },
  );

  const gallery: GalleryItem[] = gallerySource.map((item) => {
    const copy = isId ? galleryCopyId[item.slug] : undefined;
    return copy ? { ...item, ...copy } : { ...item };
  });

  const pipelineSteps = isId
    ? pipelineStepsId
    : ["pairwise", "consistency", "weights", "SAW rank"];

  return {
    profile,
    navLinks,
    projects,
    skillGroups,
    systems,
    certifications,
    gallery,
    pipelineSteps,
  };
}

const I18nContext = React.createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>(readInitialLang);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence is a nicety; switching still works for this session.
    }
  }, []);

  const toggleLang = React.useCallback(() => {
    setLang(lang === "en" ? "id" : "en");
  }, [lang, setLang]);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = React.useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const template = (lang === "id" ? idMessages : en)[key] ?? en[key];
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      );
    },
    [lang],
  );

  const value = React.useMemo<I18nValue>(
    () => ({ lang, setLang, toggleLang, t, ...buildContent(lang) }),
    [lang, setLang, toggleLang, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

// The provider and its hook stay together on purpose: splitting them would
// force every consumer to import from two paths for no real benefit.
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const value = React.useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>.");
  }
  return value;
}
