export const profile = {
  name: "Firli Satriya Putri",
  shortName: "Firli Satriya",
  monogram: "FS",
  credential: "S.Tr.Kom.",
  title:
    "Applied Informatics Engineer & BNSP Certified Associate Data Scientist",
  availability: "Available for Front-End & UI/UX Roles",
  headline: "Turning Complex Workflows & Data into Effortless Interfaces",
  bio: "Hi, I'm Firli Satriya Putri, S.Tr.Kom. Applied Informatics graduate from Universitas Airlangga and BNSP-Certified Associate Data Scientist. Experienced in revamping enterprise HRIS interfaces and shipping new features at BASARNAS, as well as contributing to UI/UX design and data quality operations at Telkom Indonesia.",
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
  /** Cover preview. `src` is the Microlink screenshot, `fallback` the local artwork. */
  cover?: { src: string; fallback?: string; alt: string };
  /** Live deployment. Cards with this become clickable links. */
  liveUrl?: string;
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    slug: "telkom-internship",
    index: "01",
    title: "UI/UX Design & AI Data Operations — Internship",
    org: "Telkom Indonesia · BigBox",
    tagline: "Executive dashboards, annotated ground truth, and model QA",
    summary:
      "Contributed to both product interface design and AI system quality assurance across enterprise and public-sector initiatives. Designed high-fidelity executive dashboards in Figma using a standardized design system, curated ground-truth datasets via manual bounding box annotation in Roboflow, and validated the real-world accuracy of OCR and CCTV-based computer vision models against manual benchmarks.",
    role: "UI/UX Design & AI Data Operations",
    year: "2025",
    tone: "mid",
    tags: ["UI/UX", "Design System", "Data Quality", "Model QA"],
    stack: [
      "Figma Design System",
      "Roboflow",
      "OCR Validation",
      "CCTV CV QA",
    ],
    metrics: [
      { label: "Period", value: "Sept–Dec" },
      { label: "Disciplines", value: "UI/UX · AI" },
      { label: "Org", value: "BigBox" },
    ],
    cover: {
      src: "/projects/telkom-internship.svg",
      alt: "Cover artwork for the Telkom Indonesia BigBox internship: the Telkom and BigBox logos side by side, an executive dashboard sketch and a CCTV frame with bounding-box annotations.",
    },
  },
  {
    slug: "dss-mlbb",
    index: "02",
    title: "Decision Support System — MLBB Hero Selection",
    org: "Applied Research",
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
    liveUrl: "https://spkmlbb.weebdev.my.id/",
    cover: {
      src: "/projects/previews/dss-mlbb.jpg",
      fallback: "/projects/dss-mlbb.svg",
      alt: "Screenshot preview of the MLBB hero-selection decision support system, with its ranking interface.",
    },
    flagship: true,
  },
  {
    slug: "maccessoris",
    index: "03",
    title: "MAccessoris",
    org: "Online Store",
    tagline: "Clean store catalogue with filtered discovery and fast checkout",
    summary:
      "A deliberately quiet online store: catalogue filtering that stays responsive as inventory grows, and a checkout path trimmed to the fewest possible steps so browsing turns into buying without friction.",
    role: "Front-End & UI/UX",
    year: "2023",
    tone: "mid",
    tags: ["Store", "Catalogue Filter", "Checkout"],
    stack: ["Responsive Web", "Filtering UI", "Checkout Flow"],
    metrics: [
      { label: "Checkout steps", value: "3" },
      { label: "Focus", value: "Speed" },
      { label: "Type", value: "Store" },
    ],
    liveUrl: "https://pos-accessories.vercel.app/",
    cover: {
      src: "/projects/previews/maccessoris.jpg",
      fallback: "/projects/maccessoris.svg",
      alt: "Screenshot preview of the MAccessoris storefront, showing its catalogue of products.",
    },
  },
  {
    slug: "firelle",
    index: "04",
    title: "FIRELLE — Point of Sale System",
    org: "FIRELLE",
    tagline: "A boutique point-of-sale system with a live demo login",
    summary:
      "FIRELLE is a web-based point-of-sale system for boutique retail: product management, checkout and transaction records in one place. The live demo is linked straight from this card, and it ships with a demo mode that runs on sample data in the browser, so the whole flow can be explored without an account.",
    role: "System Developer",
    year: "2026",
    tone: "high",
    tags: ["POS", "Retail Operations", "Web Application"],
    stack: ["Point of Sale", "Transaction Flow", "Web Application"],
    metrics: [
      { label: "Product", value: "FIRELLE" },
      { label: "Type", value: "POS" },
      { label: "Demo", value: "Live" },
    ],
    liveUrl: "https://demo.firelle.my.id/login",
    cover: {
      src: "/projects/previews/firelle.jpg",
      fallback: "/projects/firelle.svg",
      alt: "Screenshot preview of the FIRELLE point-of-sale login screen.",
    },
  },
  {
    slug: "photobooth-remote",
    index: "05",
    title: "Photobooth Remote — WebRTC Photo Booth",
    org: "Personal Project",
    tagline: "A virtual photobooth strip for 2–4 people in different cities",
    summary:
      "A browser photobooth room joinable by link and a 6-digit code — no install, no login. Each guest streams their camera, a synchronised countdown fires every shutter in the same frame, and the strip is composited locally on the GPU before landing as a high-resolution PNG, boomerang MP4, or QR handoff to a phone.",
    role: "Front-End & Real-Time Web",
    year: "2026",
    tone: "low",
    tags: ["WebRTC", "Real-Time Media", "Creative Web"],
    stack: ["WebRTC P2P", "Canvas · WebGL2", "Browser-side Rendering"],
    metrics: [
      { label: "Players", value: "2–4" },
      { label: "Capture sync", value: "< 50 ms" },
      { label: "Frames", value: "10" },
    ],
    liveUrl: "https://web-photobooth-five.vercel.app/",
    cover: {
      src: "/projects/previews/photobooth.jpg",
      fallback: "/projects/photobooth.svg",
      alt: "Screenshot preview of the Photobooth Remote landing page for its WebRTC photo booth.",
    },
  },
  {
    slug: "basarnas-bhris",
    index: "06",
    title: "BHRIS — QR Attendance & Leave Application",
    org: "BASARNAS Surabaya · Juanda",
    tagline: "Two internal HRIS features, designed in Figma then shipped as code",
    summary:
      "Designed and developed two new core features for the BHRIS website at BASARNAS Surabaya — QR Code Meeting Attendance and a Leave Application System — to cut manual steps out of internal staff administration. Both features started as end-to-end interactive Figma prototypes, then became clean, responsive web components that hold up across devices.",
    role: "UI/UX Design & Front-End",
    year: "2024",
    tone: "mid",
    tags: ["UI/UX", "HRIS", "Design-to-Code", "QR Attendance"],
    stack: ["Figma Prototyping", "Responsive Web Components", "Internal HRIS"],
    metrics: [
      { label: "Features shipped", value: "2" },
      { label: "Location", value: "Juanda" },
      { label: "Org", value: "BASARNAS" },
    ],
    cover: {
      src: "/projects/basarnas-bhris.svg",
      alt: "Cover artwork for the BASARNAS Surabaya BHRIS internship: the BASARNAS emblem beside a QR attendance panel and a leave-application form.",
    },
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
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "HTML/CSS",
        "WebRTC P2P",
        "Canvas · WebGL2",
      ],
    },
    {
      id: "uiux",
      label: "UI/UX",
      tone: "high",
      blurb: "Design systems that survive handoff",
      skills: [
        "Figma Design System",
        "Interactive Prototyping",
        "Auto-Layout",
        "Design-to-Code",
      ],
    },
    {
      id: "data",
      label: "Data & AI",
      tone: "low",
      blurb: "Algorithms that justify their ranking",
      skills: [
        "Python",
        "Flask",
        "NumPy",
        "AHP-SAW MCDM",
        "OCR Quality Control",
        "Roboflow Annotation",
        "Model QA",
      ],
    },
    {
      id: "database",
      label: "Database",
      tone: "mid",
      blurb: "Schema choices that keep queries honest",
      skills: ["SQL", "PostgreSQL", "MySQL"],
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
    title: "Auditable AHP → SAW ranking",
    detail:
      "Pairwise comparison matrix, consistency-ratio check, then weighted-sum ranking. Every weight traces back to a stated judgement, so the DSS behind the MLBB hero picker can defend its output.",
    tone: "high" as Tone,
    icon: "algorithm",
  },
  {
    title: "Zero-friction checkout",
    detail:
      "Catalogue filtering that stays responsive as inventory grows, and a buying path trimmed to three steps — the same pattern carried from the MAccessoris storefront into FIRELLE's POS.",
    tone: "mid" as Tone,
    icon: "flow",
  },
  {
    title: "Store & POS operations",
    detail:
      "Products, checkout and transaction records kept in one place instead of across spreadsheets, with a browser-side demo mode so the system can be tried before any data is stored.",
    tone: "low" as Tone,
    icon: "store",
  },
  {
    title: "Ground-truth quality loop",
    detail:
      "Bounding-box annotation in Roboflow, then OCR and CCTV model output checked against manual benchmarks — accuracy measured on real footage instead of assumed from a validation split.",
    tone: "mid" as Tone,
    icon: "scan",
  },
  {
    title: "Real-time capture pipeline",
    detail:
      "WebRTC peer-to-peer rooms with a clock-calibrated countdown, so every shutter fires on the same frame — then the strip is composited on the GPU into a PNG or boomerang MP4.",
    tone: "high" as Tone,
    icon: "capture",
  },
  {
    title: "Scan-to-verify admin flows",
    detail:
      "QR meeting attendance that replaces a paper signature with one tap and an auditable timestamp, plus a leave request path that moves through approval instead of email threads — both prototyped end-to-end in Figma before being shipped as responsive components.",
    tone: "low" as Tone,
    icon: "qr",
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
