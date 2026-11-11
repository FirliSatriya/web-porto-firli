export const profile = {
  name: "Firli Satriya Putri",
  shortName: "Firli",
  monogram: "FS",
  credential: "S.Tr.Kom.",
  title:
    "Applied Informatics Engineer & BNSP Certified Associate Data Scientist",
  availability: "Available for Front-End & UI/UX Roles",
  headline: "Engineering Scalable Interfaces Driven by Data Intelligence",
  bio: "Firli Satriya Putri, S.Tr.Kom. Applied Informatics Engineer (Universitas Airlangga) & BNSP Certified Associate Data Scientist. Translating multi-criteria decision algorithms and complex workflows into responsive, zero-friction web apps.",
  email: "firliwork2026@gmail.com",
  phone: "+62 881 0373 18755",
  phoneHref: "+62881037318755",
  linkedin: "https://www.linkedin.com/in/firli-satriya",
  linkedinLabel: "linkedin.com/in/firli-satriya",
  location: "Surabaya, Indonesia",
  university: "Universitas Airlangga",
  degree: "Bachelor of Applied Informatics Engineering",
} as const;

export const navLinks = [
  // Root-relative so the same list works from /gallery and /resume, not just
  // the landing page. Browsers treat "/#works" on "/" as a same-page scroll.
  { label: "Works", href: "/#works" },
  { label: "Systems", href: "/#systems" },
  { label: "Skills", href: "/#skills" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/#contact" },
] as const;

export type Tone = "high" | "mid" | "low";

export type Project = {
  slug: string;
  index: string;
  title: string;
  org: string;
  tagline: string;
  summary: string;
  role: string;
  year: string;
  tone: Tone;
  tags: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  /** Live deployment. Cards with this become clickable links. */
  liveUrl?: string;
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    slug: "dss-mlbb",
    index: "01",
    title: "Decision Support System — MLBB Hero Selection",
    org: "Skripsi / Applied Research",
    tagline: "AHP + SAW recommendation engine across 132 heroes",
    summary:
      "A multi-criteria decision-making platform that scores and ranks all 132 Mobile Legends heroes against weighted player criteria. The AHP layer derives criteria weights from pairwise comparisons, SAW normalizes and aggregates the matrix, and the Flask API streams a ranked recommendation straight into a responsive interface built for in-match speed.",
    role: "Full-Stack · Algorithm Design",
    year: "2025",
    tone: "high",
    tags: ["MCDM", "AHP", "SAW", "Data Science"],
    stack: ["Python", "Flask", "NumPy", "Responsive Front-End"],
    metrics: [
      { label: "Heroes scored", value: "132" },
      { label: "Criteria", value: "7" },
      { label: "Algorithms", value: "AHP · SAW" },
    ],
    liveUrl: "https://spk-mlbb.vercel.app/",
    flagship: true,
  },
  {
    slug: "bhrs-basarnas",
    index: "02",
    title: "Basarnas Surabaya — BHRIS System",
    org: "Basarnas Surabaya",
    tagline: "Internal workflow digitisation for a government rescue agency",
    summary:
      "Front-End and UI/UX delivery for BHRIS, an internal HR information system. Two shipped modules: QR-code meeting attendance for fast, auditable check-ins, and an employee leave request flow that replaced paper forms with tracked, approval-aware states.",
    role: "Front-End & UI/UX",
    year: "2024",
    tone: "mid",
    tags: ["Internal Tool", "QR Attendance", "Leave Workflow"],
    stack: ["Figma", "Responsive Web", "Clean Components"],
    metrics: [
      { label: "Modules", value: "2" },
      { label: "Paper forms removed", value: "100%" },
      { label: "Check-in", value: "QR" },
    ],
  },
  {
    slug: "telkom-talent-smartcity",
    index: "03",
    title: "Telkom Indonesia — Talent Management & Smart City Data Ops",
    org: "Telkom Indonesia",
    tagline: "Design system benchmarking + OCR & surveillance data quality",
    summary:
      "UI/UX design system work benchmarked against five global SaaS platforms to standardise talent-management surfaces, paired with data operations: OCR quality control to keep extraction accuracy honest, and Smart City surveillance monitoring dashboards for live operational oversight.",
    role: "UI/UX Engineer & Data Ops",
    year: "2024",
    tone: "low",
    tags: ["Design System", "OCR QC", "Smart City"],
    stack: ["Design System", "Figma", "OCR QA", "Monitoring Dashboard"],
    metrics: [
      { label: "SaaS benchmarks", value: "5" },
      { label: "Domains", value: "Talent · City" },
      { label: "Focus", value: "Data quality" },
    ],
  },
  {
    slug: "lobsterindo",
    index: "04",
    title: "LobsterIndo",
    org: "Commerce Platform",
    tagline: "Storefront plus internal operations portal",
    summary:
      "A full e-commerce front-end paired with an internal operations portal. The staff side handles employee attendance and shift scheduling, so storefront activity and the crew roster stay in one place instead of across spreadsheets.",
    role: "Front-End Developer",
    year: "2024",
    tone: "high",
    tags: ["E-Commerce", "Ops Portal", "Scheduling"],
    stack: ["Responsive CMS", "Attendance Module", "Scheduling UI"],
    metrics: [
      { label: "Surfaces", value: "2" },
      { label: "Ops modules", value: "2" },
      { label: "Type", value: "Commerce" },
    ],
  },
  {
    slug: "maccessoris",
    index: "05",
    title: "MAccessoris",
    org: "Commerce Platform",
    tagline: "Clean catalogue with filtered discovery and fast checkout",
    summary:
      "A deliberately quiet e-commerce experience: catalogue filtering that stays responsive as inventory grows, and a checkout path trimmed to the fewest possible steps so browsing turns into buying without friction.",
    role: "Front-End & UI/UX",
    year: "2023",
    tone: "mid",
    tags: ["E-Commerce", "Catalogue Filter", "Checkout"],
    stack: ["Responsive Web", "Filtering UI", "Checkout Flow"],
    metrics: [
      { label: "Checkout steps", value: "3" },
      { label: "Focus", value: "Speed" },
      { label: "Type", value: "Retail" },
    ],
  },
];

export type SkillGroupId = "frontend" | "uiux" | "data" | "database" | "cert";

export const skillGroups: {
  id: SkillGroupId;
  label: string;
  tone: Tone;
  blurb: string;
  skills: string[];
}[] = [
  {
    id: "frontend",
    label: "Front-End",
    tone: "high",
    blurb: "Interfaces that stay fast under real data",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "HTML/CSS",
      "JavaScript",
    ],
  },
  {
    id: "uiux",
    label: "UI/UX",
    tone: "high",
    blurb: "Design systems that survive handoff",
    skills: [
      "Figma Design System",
      "Auto-Layout",
      "Interactive Prototyping",
      "Design Thinking",
    ],
  },
  {
    id: "data",
    label: "Data & AI",
    tone: "low",
    blurb: "Algorithms that justify their ranking",
    skills: ["Python", "SQL", "AHP-SAW MCDM", "OCR Quality Control", "EDA"],
  },
  {
    id: "database",
    label: "Database",
    tone: "mid",
    blurb: "Schema choices that keep queries honest",
    skills: ["PostgreSQL", "MySQL"],
  },
  {
    id: "cert",
    label: "Certification",
    tone: "mid",
    blurb: "Verified by the national standards body",
    skills: ["BNSP Certified Associate Data Scientist (2025–2028)"],
  },
];

export const systems = [
  {
    title: "AHP → SAW pipeline",
    detail:
      "Pairwise comparison matrix, consistency ratio check, then weighted sum ranking. Weights stay auditable instead of hidden inside a model.",
    tone: "low" as Tone,
    icon: "algorithm",
  },
  {
    title: "Design system tokens",
    detail:
      "Spacing, type scale and component states defined once in Figma, mirrored in code with Tailwind tokens so QA stops finding drift.",
    tone: "high" as Tone,
    icon: "design",
  },
  {
    title: "OCR quality control",
    detail:
      "Confidence thresholds and sampling review to catch extraction errors before they reach downstream talent records.",
    tone: "mid" as Tone,
    icon: "scan",
  },
  {
    title: "Zero-friction flows",
    detail:
      "Form and approval patterns reduced to the shortest correct path — QR check-in, single-screen leave requests, three-step checkout.",
    tone: "high" as Tone,
    icon: "flow",
  },
];

export const certifications = [
  {
    name: "BNSP Certified Associate Data Scientist",
    issuer: "Badan Nasional Sertifikasi Profesi",
    period: "2025 – 2028",
    tone: "mid" as Tone,
  },
  {
    name: "Bachelor of Applied Informatics Engineering",
    issuer: "Universitas Airlangga",
    period: "S.Tr.Kom.",
    tone: "low" as Tone,
  },
];
