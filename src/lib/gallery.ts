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
    slug: "aec-lanyard",
    src: "/gallery/aec-lanyard.webp",
    width: 2400,
    height: 600,
    title: "AEC Lanyard",
    year: "2024",
    kind: "Event identity",
    note: "Strap artwork for PIMNAS × Airlangga E-Sports Championship. Partner marks, the event lockup and a neon ribbon that still reads while it is being worn.",
    alt: "Two lanyard straps on a blurred neon backdrop, carrying PUBG Mobile, PIMNAS 37, Mobile Legends and AEC marks around the event title.",
    tone: "high",
  },
  {
    slug: "aec-open-recruitment",
    src: "/gallery/aec-open-recruitment.webp",
    width: 907,
    height: 1293,
    title: "Open Recruitment",
    year: "2024",
    kind: "Campaign poster",
    note: "Staff recruitment extension for AEC: timeline, division list and a QR handoff packed into one portrait frame so nothing needed a second slide.",
    alt: "Portrait recruitment poster with a neon triangle, a three-step timeline and a two-column checklist of divisions.",
    tone: "mid",
  },
  {
    slug: "aec-certificate",
    src: "/gallery/aec-certificate.webp",
    width: 1600,
    height: 1131,
    title: "AEC Certificate",
    year: "2024",
    kind: "Print",
    note: "Participant and committee certificate, framed in the event's navy and gold with the full partner strip still legible at print size.",
    alt: "Landscape certificate with gold geometric corners, a partner logo strip and the recipient's name set in bold.",
    tone: "low",
  },
  {
    slug: "aec-winner-mlbb",
    src: "/gallery/aec-winner-mlbb.webp",
    width: 1800,
    height: 1273,
    title: "Winner Board — MLBB",
    year: "2024",
    kind: "Award visual",
    note: "First-place board for the Mobile Legends bracket: one line of type big enough to read from the back of the venue.",
    alt: "Purple and blue geometric winner board reading 1st Winner, category Mobile Legends Bang Bang.",
    tone: "high",
  },
  {
    slug: "aec-winner-pubg",
    src: "/gallery/aec-winner-pubg.webp",
    width: 1800,
    height: 1273,
    title: "Winner Board — PUBG",
    year: "2024",
    kind: "Award visual",
    note: "The PUBG Mobile counterpart. Same lockup and type scale, a different light signature, so both stages still feel like one event.",
    alt: "Blue and magenta winner board reading 1st Winner, category PUBG Mobile.",
    tone: "mid",
  },
];
