import type { Tone } from "@/lib/content";

export type GalleryItem = {
  slug: string;
  /** Path under /public. Swapping these files is enough to re-skin the wall. */
  src: string;
  /** Intrinsic size keeps the masonry honest and prevents layout shift. */
  width: number;
  height: number;
  title: string;
  year: string;
  kind: string;
  note: string;
  alt: string;
  tone: Tone;
};

export const gallery: GalleryItem[] = [
  {
    slug: "hero-ranking",
    src: "/gallery/hero-selection.svg",
    width: 1200,
    height: 1500,
    title: "Hero Ranking Study",
    year: "2025",
    kind: "Data visual",
    note: "Weighted scores from an AHP → SAW run, drawn as a descending ladder so the recommendation reads before the numbers do.",
    alt: "Print-style poster with a descending bar chart and an orbit diagram.",
    tone: "high",
  },
  {
    slug: "scan-station",
    src: "/gallery/qr-checkin.svg",
    width: 1200,
    height: 1500,
    title: "Scan Station",
    year: "2024",
    kind: "Interface",
    note: "QR attendance pass for BHRIS. One target, one tap, one auditable timestamp instead of a paper signature.",
    alt: "Inverted panel with a stylised QR code, a scan line and a verified check-in badge.",
    tone: "low",
  },
  {
    slug: "token-sheet",
    src: "/gallery/token-sheet.svg",
    width: 1200,
    height: 1200,
    title: "Token Sheet",
    year: "2024",
    kind: "Design system",
    note: "Swatches, type scale and spacing steps documented once, so handoff stops drifting between Figma and code.",
    alt: "Design token sheet with a grid of grey swatches, a large Aa specimen and a spacing step row.",
    tone: "mid",
  },
  {
    slug: "city-grid",
    src: "/gallery/smart-city.svg",
    width: 1200,
    height: 1600,
    title: "City Grid",
    year: "2024",
    kind: "Monitoring",
    note: "Surveillance dashboard draft: a skyline chart and a node strip for live operational oversight.",
    alt: "Inverted dashboard study with bar-chart towers, signal lines and an activity strip.",
    tone: "low",
  },
  {
    slug: "storefront-draft",
    src: "/gallery/storefront.svg",
    width: 1200,
    height: 1500,
    title: "Storefront Draft",
    year: "2024",
    kind: "Commerce",
    note: "Catalogue tiles and a three-step checkout, trimmed until only the buying path survived.",
    alt: "Storefront layout study with two columns of product tiles and a solid checkout bar.",
    tone: "mid",
  },
  {
    slug: "ring-study",
    src: "/gallery/catalogue-filter.svg",
    width: 1200,
    height: 1600,
    title: "Ring Study",
    year: "2023",
    kind: "Catalogue",
    note: "Filter chips over a single product. Quiet contrast so the inventory does the talking.",
    alt: "Catalog filter study with pill chips, a large ring illustration on a hatched panel and two result cards.",
    tone: "high",
  },
  {
    slug: "consistency",
    src: "/gallery/consistency.svg",
    width: 1200,
    height: 1200,
    title: "Consistency Ratio",
    year: "2025",
    kind: "Data visual",
    note: "The pairwise matrix behind every AHP weight, next to the ratio that proves the comparisons hold.",
    alt: "Square matrix graphic with a highlighted diagonal and a large 0.042 consistency ratio.",
    tone: "high",
  },
  {
    slug: "approval-flow",
    src: "/gallery/leave-flow.svg",
    width: 1400,
    height: 1050,
    title: "Approval Flow",
    year: "2024",
    kind: "Workflow",
    note: "Leave requests drawn as states, not paper: request, review, approve, or bounce back for revision.",
    alt: "Horizontal approval flow diagram with four nodes and a rejected branch falling below.",
    tone: "mid",
  },
  {
    slug: "zero-g-orbit",
    src: "/gallery/zero-g.svg",
    width: 1200,
    height: 1500,
    title: "Zero-G Orbit",
    year: "2026",
    kind: "Experiment",
    note: "A gravity-off study for the skills arena. Everything drifts, nothing settles.",
    alt: "Concentric orbit rings around a solid core with scattered particle dots.",
    tone: "high",
  },
  {
    slug: "type-and-grid",
    src: "/gallery/type-poster.svg",
    width: 1200,
    height: 1600,
    title: "Type & Grid",
    year: "2025",
    kind: "Poster",
    note: "A specimen playing weight against a twelve-column grid, drawn for print rather than the feed.",
    alt: "Inverted typographic poster with large FK lettering, a rule and stacked text bars.",
    tone: "low",
  },
];
