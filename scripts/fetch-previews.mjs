#!/usr/bin/env node
/**
 * Regenerates the project preview images shown on the portfolio cards.
 *
 * Microlink renders one screenshot per URL and serves it as a JPEG
 * (`embed=screenshot.url`). The output is committed to
 * `public/projects/previews/` so the site never calls Microlink at runtime:
 * the free tier only allows 5 requests per day, which a single page view with
 * four cards would mostly consume. Run this after a project deployment:
 *
 *   npm run previews
 *
 * Docs: https://microlink.io/docs/api/parameters/screenshot
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(ROOT, "public/projects/previews");

/** Keep in sync with the `projects` array in `src/lib/content.ts`. */
const TARGETS = [
  { slug: "dss-mlbb", url: "https://spkmlbb.weebdev.my.id/" },
  { slug: "maccessoris", url: "https://pos-accessories.vercel.app/" },
  { slug: "firelle", url: "https://demo.firelle.my.id/login" },
  { slug: "photobooth", url: "https://web-photobooth-five.vercel.app/" },
];

const WIDTH = 1200;
const HEIGHT = 675;
const ATTEMPTS = 3;
const RETRY_DELAY_MS = 8_000;

function previewUrl(target) {
  const params = new URLSearchParams({
    url: target.url,
    screenshot: "true",
    "screenshot.type": "jpeg",
    meta: "false",
    embed: "screenshot.url",
    ttl: "1d",
    "viewport.width": String(WIDTH),
    "viewport.height": String(HEIGHT),
  });

  return `https://api.microlink.io/?${params.toString()}`;
}

const wait = (ms) => new Promise((done) => setTimeout(done, ms));

async function render(target) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    let response;

    try {
      response = await fetch(previewUrl(target));
    } catch (error) {
      return { ok: false, reason: `network error: ${error.message}` };
    }

    const remaining = response.headers.get("x-rate-limit-remaining");

    if (response.ok) {
      const bytes = Buffer.from(await response.arrayBuffer());
      const file = resolve(OUT_DIR, `${target.slug}.jpg`);

      await mkdir(OUT_DIR, { recursive: true });
      await writeFile(file, bytes);

      return { ok: true, bytes: bytes.length, remaining };
    }

    // The free tier is limited to 5 requests/day and 2 concurrent renders, so a
    // 429 is expected once the quota is spent; retrying with backoff covers the
    // transient concurrency case only.
    if (response.status === 429 && attempt < ATTEMPTS) {
      await wait(RETRY_DELAY_MS * attempt);
      continue;
    }

    return {
      ok: false,
      reason: `HTTP ${response.status}`,
      remaining,
    };
  }

  return { ok: false, reason: "gave up after retries" };
}

if (process.argv.includes("--dry-run")) {
  for (const target of TARGETS) {
    console.log(`${target.slug}: ${previewUrl(target)}`);
  }
  process.exit(0);
}

let failed = 0;

// Sequential on purpose: the free plan allows two concurrent renders and going
// over that answers 429, so there is nothing to gain from parallel calls.
for (const target of TARGETS) {
  const result = await render(target);

  if (result.ok) {
    const quota = result.remaining ? `, ${result.remaining} left today` : "";
    console.log(`ok   ${target.slug} (${(result.bytes / 1024).toFixed(0)} kB${quota})`);
  } else {
    failed += 1;
    console.error(`fail ${target.slug}: ${result.reason}`);
  }
}

if (failed > 0) {
  console.error(
    `\n${failed} preview(s) kept at their previous image. ` +
      "Microlink's free quota resets daily; re-run once it does.",
  );
  process.exitCode = 1;
}
