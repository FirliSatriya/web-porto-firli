/**
 * Zero-gravity skill pill physics.
 *
 * Runs in a Web Worker so a few hundred pill-to-pill collision checks never
 * touch the main thread. Position/velocity are plain floats; the renderer on
 * the main thread only maps them onto transforms.
 */

export type PillSeed = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type PillState = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  av: number;
};

export type WorkerIn =
  | { type: "init"; width: number; height: number; pills: PillSeed[]; zeroG: boolean }
  | { type: "resize"; width: number; height: number }
  | {
      type: "grab";
      id: string;
      pointerX: number;
      pointerY: number;
    }
  | { type: "drag"; id: string; pointerX: number; pointerY: number }
  | { type: "pointer"; x: number; y: number }
  | { type: "pointer-leave" }
  | { type: "release"; id: string }
  | { type: "toggle"; zeroG: boolean }
  | { type: "pause"; paused: boolean }
  | { type: "kick"; id: string; vx: number; vy: number }
  | { type: "step"; dt: number };

export type WorkerOut = {
  type: "tick";
  pills: PillState[];
};

const REPULSION_STRENGTH = 220;
const REPULSION_RADIUS_PAD = 78;

export class PillWorld {
  private width = 0;
  private height = 0;
  private pills: (PillState & { w: number; h: number })[] = [];
  private zeroG = true;
  private paused = false;
  private dragged: string | null = null;
  private dragTarget = { x: 0, y: 0 };
  private dragVelocity = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };
  private hasPointer = false;

  constructor(private out: (message: WorkerOut) => void) {}

  init(width: number, height: number, seeds: PillSeed[], zeroG: boolean) {
    this.width = width;
    this.height = height;
    this.zeroG = zeroG;

    this.pills = seeds.map((seed, index) => {
      const existing = this.pills.find((pill) => pill.id === seed.id);
      const angle = existing?.angle ?? (Math.random() - 0.5) * 0.14;
      const av = existing?.av ?? (Math.random() - 0.5) * 0.5;
      const speed = this.zeroG ? 0.34 : 0;

      return {
        id: seed.id,
        w: seed.width,
        h: seed.height,
        x: seed.x,
        y: seed.y,
        vx: existing?.vx ?? Math.cos(index * 2.399) * speed,
        vy: existing?.vy ?? Math.sin(index * 2.399) * speed,
        angle,
        av,
      };
    });
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    for (const pill of this.pills) {
      pill.x = clamp(pill.x, pill.w / 2, width - pill.w / 2);
      pill.y = clamp(pill.y, pill.h / 2, height - pill.h / 2);
    }
  }

  setZeroG(zeroG: boolean) {
    this.zeroG = zeroG;
    if (zeroG) {
      // Give everything a nudge so "off -> on" reads instantly.
      for (const pill of this.pills) {
        pill.vx += (Math.random() - 0.5) * 1.1;
        pill.vy += (Math.random() - 0.5) * 1.1;
      }
    }
  }

  pause(paused: boolean) {
    this.paused = paused;
  }

  grab(id: string, x: number, y: number) {
    this.dragged = id;
    this.dragTarget = { x, y };
    const pill = this.pills.find((p) => p.id === id);
    if (pill) {
      pill.vx = 0;
      pill.vy = 0;
    }
  }

  drag(id: string, x: number, y: number) {
    if (this.dragged !== id) return;
    const pill = this.pills.find((p) => p.id === id);
    if (!pill) return;

    const cos = Math.abs(Math.cos(pill.angle));
    const sin = Math.abs(Math.sin(pill.angle));
    const halfW = (pill.w * cos + pill.h * sin) / 2;
    const halfH = (pill.w * sin + pill.h * cos) / 2;

    const nextX = clamp(x, halfW, this.width - halfW);
    const nextY = clamp(y, halfH, this.height - halfH);

    this.dragVelocity = {
      x: nextX - this.dragTarget.x,
      y: nextY - this.dragTarget.y,
    };
    this.dragTarget = { x: nextX, y: nextY };
  }

  release(id: string) {
    if (this.dragged !== id) return;
    const pill = this.pills.find((p) => p.id === id);
    this.dragged = null;

    if (!pill) return;

    // Fling: carry the drag momentum, clamped so nothing rockets away.
    pill.vx = clamp(this.dragVelocity.x * 0.9, -26, 26);
    pill.vy = clamp(this.dragVelocity.y * 0.9, -26, 26);
    pill.av = clamp(this.dragVelocity.x * 0.02, -0.6, 0.6);
    this.dragVelocity = { x: 0, y: 0 };
  }

  kick(id: string, vx: number, vy: number) {
    const pill = this.pills.find((p) => p.id === id);
    if (!pill) return;
    pill.vx += clamp(vx, -20, 20);
    pill.vy += clamp(vy, -20, 20);
  }

  step(dt: number) {
    if (!this.pills.length || !this.width || !this.height) return;
    if (this.paused) {
      this.emit();
      return;
    }

    if (this.hasPointer) this.repulse(this.pointer.x, this.pointer.y);

    const frame = Math.min(dt, 32) / 16.667; // normalise to ~60fps steps

    for (const pill of this.pills) {
      if (this.dragged === pill.id) {
        pill.x += (this.dragTarget.x - pill.x) * 0.42;
        pill.y += (this.dragTarget.y - pill.y) * 0.42;
      } else {
        if (this.zeroG) {
          // weightless drift with a touch of damping
          pill.vx *= 0.995;
          pill.vy *= 0.995;
        } else {
          pill.vy += 0.075 * frame;
          pill.vx *= 0.988;
          pill.vy *= 0.996;
        }

        pill.x += pill.vx * frame;
        pill.y += pill.vy * frame;
      }

      if (!this.zeroG && this.dragged !== pill.id) {
        const cos0 = Math.abs(Math.cos(pill.angle));
        const sin0 = Math.abs(Math.sin(pill.angle));
        const floor = this.height - (pill.w * sin0 + pill.h * cos0) / 2;
        if (pill.y > floor) {
          pill.y = floor;
          pill.vy *= -0.42;
          pill.vx *= 0.86;
          pill.av *= 0.8;
          if (Math.abs(pill.vy) < 0.6) pill.vy = 0;
        }
      }

      // walls — a rotated pill occupies more space than its width/height, so the
      // clamp has to use the rotated axis-aligned bounds.
      const cos = Math.abs(Math.cos(pill.angle));
      const sin = Math.abs(Math.sin(pill.angle));
      const halfW = (pill.w * cos + pill.h * sin) / 2;
      const halfH = (pill.w * sin + pill.h * cos) / 2;

      const minX = halfW;
      const maxX = this.width - halfW;
      const minY = halfH;
      const maxY = this.height - halfH;

      if (pill.x < minX) {
        pill.x = minX;
        pill.vx = Math.abs(pill.vx) * 0.62;
      } else if (pill.x > maxX) {
        pill.x = maxX;
        pill.vx = -Math.abs(pill.vx) * 0.62;
      }

      if (pill.y < minY) {
        pill.y = minY;
        pill.vy = Math.abs(pill.vy) * 0.62;
      } else if (pill.y > maxY) {
        pill.y = maxY;
        pill.vy = -Math.abs(pill.vy) * 0.62;
      }

      if (this.zeroG) {
        pill.angle += pill.av * 0.05 * frame;
        pill.angle = clamp(pill.angle, -0.22, 0.22);
      } else {
        pill.angle *= 0.96;
        pill.av *= 0.96;
      }
    }

    this.separate(frame);
    this.emit();
  }

  /** Soft pill-vs-pill separation: enough to avoid overlap, cheap enough to scale. */
  private separate(frame: number) {
    const count = this.pills.length;

    for (let i = 0; i < count; i += 1) {
      const a = this.pills[i];

      for (let j = i + 1; j < count; j += 1) {
        const b = this.pills[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const overlapX = (a.w + b.w) / 2 - Math.abs(dx);
        const overlapY = (a.h + b.h) / 2 - Math.abs(dy);

        if (overlapX <= 0 || overlapY <= 0) continue;

        // Resolve on the axis with the smaller penetration.
        if (overlapX < overlapY) {
          const push = (overlapX / 2) * 0.34 * frame;
          const dir = dx === 0 ? (i % 2 === 0 ? 1 : -1) : Math.sign(dx);
          if (this.dragged !== a.id) a.x -= push * dir;
          if (this.dragged !== b.id) b.x += push * dir;
          if (this.zeroG) {
            const transfer = 0.018 * frame;
            a.vx -= dir * transfer;
            b.vx += dir * transfer;
          }
        } else {
          const push = (overlapY / 2) * 0.34 * frame;
          const dir = dy === 0 ? (i % 2 === 0 ? 1 : -1) : Math.sign(dy);
          if (this.dragged !== a.id) a.y -= push * dir;
          if (this.dragged !== b.id) b.y += push * dir;
          if (this.zeroG) {
            const transfer = 0.018 * frame;
            a.vy -= dir * transfer;
            b.vy += dir * transfer;
          }
        }
      }
    }
  }

  /** Pointer repulsion so the arena feels alive without a drag. */
  setPointer(x: number, y: number) {
    this.pointer = { x, y };
    this.hasPointer = true;
  }

  clearPointer() {
    this.hasPointer = false;
  }

  private repulse(pointerX: number, pointerY: number) {
    for (const pill of this.pills) {
      if (this.dragged === pill.id) continue;

      const dx = pill.x - pointerX;
      const dy = pill.y - pointerY;
      const distance = Math.hypot(dx, dy);
      const reach = Math.max(pill.w, pill.h) / 2 + REPULSION_RADIUS_PAD;

      if (distance > reach || distance === 0) continue;

      const force = (1 - distance / reach) * 0.9;
      pill.vx += (dx / distance) * force * (REPULSION_STRENGTH / 1000);
      pill.vy += (dy / distance) * force * (REPULSION_STRENGTH / 1000);
    }
  }

  private emit() {
    this.out({
      type: "tick",
      pills: this.pills.map((pill) => ({
        id: pill.id,
        x: pill.x,
        y: pill.y,
        vx: pill.vx,
        vy: pill.vy,
        angle: pill.angle,
        av: pill.av,
      })),
    });
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
