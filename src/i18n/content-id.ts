import type { SkillGroupId } from "@/lib/content";

/**
 * Indonesian overrides for the content in `src/lib/content.ts` and
 * `src/lib/gallery.ts`. Only display copy is translated: slugs, tags, stack
 * names, ids and the `S.Tr.Kom.` period stay untouched so filtering, pill ids
 * and the credential icon keep working in both languages.
 */

export const profileId = {
  title: "Engineer Informatika Terapan & Data Scientist Bersertifikat BNSP",
  availability: "Terbuka untuk peran Front-End & UI/UX",
  headline:
    "Mengubah Alur Kerja & Data yang Rumit menjadi Antarmuka yang Mulus",
  bio: "Hai, saya Firli Satriya Putri, S.Tr.Kom. Lulusan Informatika Terapan Universitas Airlangga dan Data Scientist Bersertifikat BNSP. Berpengalaman merombak antarmuka HRIS enterprise serta mengirim fitur baru di BASARNAS, juga berkontribusi pada desain UI/UX dan operasi kualitas data di Telkom Indonesia.",
  degree: "Sarjana Terapan Teknik Informatika",
} as const;

export const navLabelsId: Record<string, string> = {
  "/#works": "Karya",
  "/#systems": "Sistem",
  "/#skills": "Keahlian",
  "/gallery": "Galeri",
  "/#contact": "Kontak",
};

type ProjectCopy = {
  title: string;
  org: string;
  tagline: string;
  summary: string;
  role: string;
  metrics: { label: string; value: string }[];
  coverAlt: string;
};

export const projectCopyId: Record<string, ProjectCopy> = {
  "telkom-internship": {
    title: "Desain UI/UX & Operasi Data AI — Magang",
    org: "Telkom Indonesia · BigBox",
    tagline: "Dashboard eksekutif, ground truth beranotasi, dan QA model",
    summary:
      "Berkontribusi pada desain antarmuka produk sekaligus penjaminan kualitas sistem AI di berbagai inisiatif enterprise dan sektor publik. Merancang dashboard eksekutif high-fidelity di Figma dengan design system terstandar, mengkurasi dataset ground truth melalui anotasi bounding box manual di Roboflow, dan memvalidasi akurasi model computer vision berbasis OCR serta CCTV terhadap benchmark manual.",
    role: "Desain UI/UX & Operasi Data AI",
    metrics: [
      { label: "Periode", value: "Sept–Des" },
      { label: "Disiplin", value: "UI/UX · AI" },
      { label: "Organisasi", value: "BigBox" },
    ],
    coverAlt:
      "Karya sampul untuk magang Telkom Indonesia BigBox: logo Telkom dan BigBox berdampingan, sketsa dashboard eksekutif, dan frame CCTV dengan anotasi bounding box.",
  },
  "dss-mlbb": {
    title: "Sistem Pendukung Keputusan — Pemilihan Hero MLBB",
    org: "Riset Terapan",
    tagline: "Mesin rekomendasi AHP + SAW untuk 132 hero",
    summary:
      "Platform pengambilan keputusan multi-kriteria yang menilai dan memeringkat seluruh 132 hero Mobile Legends berdasarkan kriteria pemain berbobot. Lapisan AHP menurunkan bobot kriteria dari perbandingan berpasangan, SAW menormalisasi dan mengagregasi matriks, lalu API Flask mengalirkan rekomendasi berperingkat langsung ke antarmuka responsif yang dirancang untuk kecepatan saat pertandingan.",
    role: "Full-Stack · Perancangan Algoritma",
    metrics: [
      { label: "Hero dinilai", value: "132" },
      { label: "Kriteria", value: "7" },
      { label: "Algoritma", value: "AHP · SAW" },
    ],
    coverAlt:
      "Pratinjau tangkapan layar sistem pendukung keputusan pemilihan hero MLBB beserta antarmuka peringkatnya.",
  },
  maccessoris: {
    title: "MAccessoris",
    org: "Toko Online",
    tagline: "Katalog toko rapi dengan penemuan terfilter dan checkout cepat",
    summary:
      "Toko online yang sengaja dibuat tenang: filter katalog tetap responsif seiring pertumbuhan inventaris, dan alur checkout dipangkas seminimal mungkin sehingga menjelajah berubah menjadi membeli tanpa friksi.",
    role: "Front-End & UI/UX",
    metrics: [
      { label: "Langkah checkout", value: "3" },
      { label: "Fokus", value: "Kecepatan" },
      { label: "Tipe", value: "Toko" },
    ],
    coverAlt:
      "Pratinjau tangkapan layar etalase MAccessoris yang menampilkan katalog produknya.",
  },
  firelle: {
    title: "FIRELLE — Sistem Point of Sale",
    org: "FIRELLE",
    tagline: "Sistem point-of-sale butik dengan login demo langsung",
    summary:
      "FIRELLE adalah sistem point-of-sale berbasis web untuk ritel butik: manajemen produk, checkout, dan catatan transaksi dalam satu tempat. Demo langsung tertaut dari kartu ini, dan sistemnya dilengkapi mode demo yang berjalan dengan data contoh di browser, jadi seluruh alur bisa dijelajahi tanpa akun.",
    role: "Pengembang Sistem",
    metrics: [
      { label: "Produk", value: "FIRELLE" },
      { label: "Tipe", value: "POS" },
      { label: "Demo", value: "Langsung" },
    ],
    coverAlt:
      "Pratinjau tangkapan layar halaman login point-of-sale FIRELLE.",
  },
  "photobooth-remote": {
    title: "Photobooth Remote — Photo Booth WebRTC",
    org: "Proyek Pribadi",
    tagline: "Strip photobooth virtual untuk 2–4 orang di kota berbeda",
    summary:
      "Ruang photobooth di browser yang bisa dimasuki lewat tautan dan kode 6 digit — tanpa instalasi, tanpa login. Setiap tamu menyalurkan kameranya, hitung mundur tersinkron memicu semua rana di frame yang sama, dan strip dikomposisi secara lokal di GPU sebelum tersimpan sebagai PNG resolusi tinggi, MP4 boomerang, atau serah-terima QR ke ponsel.",
    role: "Front-End & Web Real-Time",
    metrics: [
      { label: "Peserta", value: "2–4" },
      { label: "Sinkron capture", value: "< 50 ms" },
      { label: "Frame", value: "10" },
    ],
    coverAlt:
      "Pratinjau tangkapan layar landing page Photobooth Remote untuk photo booth WebRTC-nya.",
  },
  "basarnas-bhris": {
    title: "BHRIS — Absensi QR & Pengajuan Cuti",
    org: "BASARNAS Surabaya · Juanda",
    tagline:
      "Dua fitur HRIS internal, dirancang di Figma lalu dikirim sebagai kode",
    summary:
      "Merancang dan mengembangkan dua fitur inti baru untuk situs BHRIS di BASARNAS Surabaya — Absensi Rapat berbasis QR Code dan Sistem Pengajuan Cuti — untuk memangkas langkah manual dalam administrasi staf internal. Kedua fitur dimulai sebagai prototipe Figma interaktif end-to-end, lalu menjadi komponen web responsif yang rapi dan konsisten di berbagai perangkat.",
    role: "Desain UI/UX & Front-End",
    metrics: [
      { label: "Fitur dikirim", value: "2" },
      { label: "Lokasi", value: "Juanda" },
      { label: "Organisasi", value: "BASARNAS" },
    ],
    coverAlt:
      "Karya sampul untuk magang BHRIS BASARNAS Surabaya: lambang BASARNAS di samping panel absensi QR dan formulir pengajuan cuti.",
  },
};

/** Keyed by the system icon, which is unique per entry. */
export const systemCopyId: Record<string, { title: string; detail: string }> = {
  algorithm: {
    title: "Peringkat AHP → SAW yang dapat diaudit",
    detail:
      "Matriks perbandingan berpasangan, pemeriksaan consistency ratio, lalu peringkat weighted-sum. Setiap bobot bisa dilacak ke penilaian yang dinyatakan, sehingga DSS di balik pemilih hero MLBB dapat mempertanggungjawabkan keluarannya.",
  },
  flow: {
    title: "Checkout tanpa friksi",
    detail:
      "Filter katalog yang tetap responsif seiring pertumbuhan inventaris, dan alur pembelian yang dipangkas jadi tiga langkah — pola yang sama dibawa dari etalase MAccessoris ke POS FIRELLE.",
  },
  store: {
    title: "Operasi toko & POS",
    detail:
      "Produk, checkout, dan catatan transaksi tersimpan di satu tempat alih-alih tersebar di spreadsheet, dengan mode demo di sisi browser agar sistem bisa dicoba sebelum ada data yang disimpan.",
  },
  scan: {
    title: "Loop kualitas ground truth",
    detail:
      "Anotasi bounding box di Roboflow, lalu keluaran model OCR dan CCTV diperiksa terhadap benchmark manual — akurasi diukur pada rekaman nyata, bukan diasumsikan dari validation split.",
  },
  capture: {
    title: "Pipeline capture real-time",
    detail:
      "Ruang peer-to-peer WebRTC dengan hitung mundur terkalibrasi jam, sehingga setiap rana memicu di frame yang sama — lalu strip dikomposisi di GPU menjadi PNG atau MP4 boomerang.",
  },
  qr: {
    title: "Alur admin scan-to-verify",
    detail:
      "Absensi rapat QR yang menggantikan tanda tangan kertas dengan satu ketukan dan timestamp yang dapat diaudit, plus alur pengajuan cuti yang melewati persetujuan alih-alih utas email — keduanya diprototipekan end-to-end di Figma sebelum dikirim sebagai komponen responsif.",
  },
};

export const skillGroupCopyId: Record<
  SkillGroupId,
  { label: string; blurb: string }
> = {
  frontend: {
    label: "Front-End",
    blurb: "Antarmuka yang tetap cepat dengan data nyata",
  },
  uiux: {
    label: "UI/UX",
    blurb: "Design system yang bertahan saat handoff",
  },
  data: {
    label: "Data & AI",
    blurb: "Algoritma yang bisa mempertanggungjawabkan peringkatnya",
  },
  database: {
    label: "Basis Data",
    blurb: "Pilihan skema yang menjaga query tetap jujur",
  },
  cert: {
    label: "Sertifikasi",
    blurb: "Terverifikasi oleh badan standar nasional",
  },
};

/** Positional: matches the order in `certifications`. */
export const certificationCopyId = [
  {
    name: "BNSP Certified Associate Data Scientist",
    issuer: "Badan Nasional Sertifikasi Profesi",
  },
  {
    name: "Sarjana Terapan Teknik Informatika",
    issuer: "Universitas Airlangga",
  },
];

export const pipelineStepsId = [
  "berpasangan",
  "konsistensi",
  "bobot",
  "peringkat SAW",
];

export const galleryCopyId: Record<
  string,
  { title: string; kind: string; note: string; alt: string }
> = {
  "aec-lanyard": {
    title: "Lanyard AEC",
    kind: "Identitas acara",
    note: "Karya tali lanyard untuk PIMNAS × Airlangga E-Sports Championship. Logo partner, lockup acara, dan pita neon yang tetap terbaca saat dikenakan.",
    alt: "Dua tali lanyard di atas latar neon buram, membawa logo PUBG Mobile, PIMNAS 37, Mobile Legends, dan AEC di sekitar judul acara.",
  },
  "aec-open-recruitment": {
    title: "Rekrutmen Terbuka",
    kind: "Poster kampanye",
    note: "Perpanjangan rekrutmen staf AEC: linimasa, daftar divisi, dan serah-terima QR dalam satu bingkai potret sehingga tidak perlu slide kedua.",
    alt: "Poster rekrutmen potret dengan segitiga neon, linimasa tiga langkah, dan daftar divisi dua kolom.",
  },
  "aec-certificate": {
    title: "Sertifikat AEC",
    kind: "Cetak",
    note: "Sertifikat peserta dan kepanitiaan, dibingkai warna navy dan emas acara dengan strip partner yang tetap terbaca di ukuran cetak.",
    alt: "Sertifikat lanskap dengan sudut geometris emas, strip logo partner, dan nama penerima dalam huruf tebal.",
  },
  "aec-winner-mlbb": {
    title: "Papan Juara — MLBB",
    kind: "Visual penghargaan",
    note: "Papan juara pertama untuk bracket Mobile Legends: satu baris teks yang cukup besar untuk dibaca dari belakang venue.",
    alt: "Papan juara geometris ungu dan biru bertuliskan Juara 1, kategori Mobile Legends Bang Bang.",
  },
  "aec-winner-pubg": {
    title: "Papan Juara — PUBG",
    kind: "Visual penghargaan",
    note: "Padanan untuk PUBG Mobile. Lockup dan skala huruf sama, tanda cahaya berbeda, sehingga kedua panggung tetap terasa satu acara.",
    alt: "Papan juara biru dan magenta bertuliskan Juara 1, kategori PUBG Mobile.",
  },
  "hero-ranking": {
    title: "Studi Peringkat Hero",
    kind: "Visual data",
    note: "Skor berbobot dari satu jalur AHP → SAW, digambar sebagai tangga menurun agar rekomendasi terbaca sebelum angka-angka.",
    alt: "Poster bergaya cetak dengan grafik batang menurun dan diagram orbit.",
  },
  "scan-station": {
    title: "Stasiun Pindai",
    kind: "Antarmuka",
    note: "Pass absensi QR untuk BHRIS. Satu target, satu ketukan, satu timestamp yang dapat diaudit, menggantikan tanda tangan kertas.",
    alt: "Panel terbalik dengan kode QR bergaya, garis pindai, dan lencana check-in terverifikasi.",
  },
  "token-sheet": {
    title: "Lembar Token",
    kind: "Design system",
    note: "Swatch, skala huruf, dan langkah spacing didokumentasikan sekali, sehingga handoff berhenti melenceng antara Figma dan kode.",
    alt: "Lembar token desain dengan kisi swatch abu-abu, spesimen Aa besar, dan baris langkah spacing.",
  },
  "city-grid": {
    title: "Kisi Kota",
    kind: "Monitoring",
    note: "Draf dashboard pengawasan: grafik skyline dan strip node untuk pemantauan operasional langsung.",
    alt: "Studi dashboard terbalik dengan menara grafik batang, garis sinyal, dan strip aktivitas.",
  },
  "storefront-draft": {
    title: "Draf Etalase",
    kind: "Toko",
    note: "Tile katalog dan checkout tiga langkah, dipangkas sampai hanya alur membeli yang tersisa.",
    alt: "Studi tata letak etalase dengan dua kolom tile produk dan bilah checkout solid.",
  },
  "ring-study": {
    title: "Studi Cincin",
    kind: "Katalog",
    note: "Chip filter di atas satu produk. Kontras tenang agar inventaris yang berbicara.",
    alt: "Studi filter katalog dengan chip pil, ilustrasi cincin besar di panel berarsir, dan dua kartu hasil.",
  },
  consistency: {
    title: "Rasio Konsistensi",
    kind: "Visual data",
    note: "Matriks berpasangan di balik setiap bobot AHP, bersanding dengan rasio yang membuktikan perbandingannya konsisten.",
    alt: "Grafik matriks persegi dengan diagonal disorot dan consistency ratio 0,042 berukuran besar.",
  },
  "approval-flow": {
    title: "Alur Persetujuan",
    kind: "Alur kerja",
    note: "Pengajuan cuti digambar sebagai state, bukan kertas: ajukan, tinjau, setujui, atau kembalikan untuk revisi.",
    alt: "Diagram alur persetujuan horizontal dengan empat node dan cabang penolakan yang jatuh ke bawah.",
  },
  "zero-g-orbit": {
    title: "Orbit Zero-G",
    kind: "Eksperimen",
    note: "Studi gravitasi mati untuk arena keahlian. Semuanya melayang, tidak ada yang menetap.",
    alt: "Cincin orbit konsentris di sekitar inti solid dengan titik partikel tersebar.",
  },
  "type-and-grid": {
    title: "Tipografi & Kisi",
    kind: "Poster",
    note: "Spesimen yang memainkan ketebalan huruf melawan kisi dua belas kolom, digambar untuk cetak, bukan untuk feed.",
    alt: "Poster tipografi terbalik dengan huruf FK besar, garis aturan, dan batang teks bertumpuk.",
  },
};
