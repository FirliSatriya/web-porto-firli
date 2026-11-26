/**
 * Zero-gravity skill pill physics.
 *
 * Deliberately plain and self-contained: the arena owns one instance, steps it
 * from a single requestAnimationFrame loop, and reads the positions back as a
 * return value. No worker, no message ordering, no second source of truth —
 * with ~22 bodies the whole simulation costs well under a millisecond a frame.
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

type Body = PillState & {
  w: number;
  h: number;
  /** Resting on the floor or on another pill last frame. */
  supported: boolean;
};

const REPULSION_STRENGTH = 220;
const REPULSION_RADIUS_PAD = 78;

/** Drift speed in px/frame. Slow enough to read, fast enough to see. */
const DRIFT_SPEED = 0.62;
/** Below this, zero-g pills are nudged back up to speed so the arena never dies. */
const DRIFT_FLOOR = 0.3;
const MAX_ANGLE = 0.22;

export class PillWorld {
  private width = 0;
  private height = 0;
  private pills: Body[] = [];
  private zeroG: boolean;
  /** Honour `prefers-reduced-motion`: no ambient motion, but drags still work. */
  private still = false;
  private dragged: string | null = null;
  private dragTarget = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };
  private hasPointer = false;

  constructor(
    width: number,
    height: number,
    seeds: PillSeed[],
    zeroG: boolean,
  ) {
    this.width = width;
    this.height = height;
    this.zeroG = zeroG;
    this.reset(seeds);
  }

  /**
   * Re-seed the field. Used for the first layout, for a filter change and for
   * the reset button — always in place, so the running animation loop keeps its
   * reference to this instance.
   */
  reset(seeds: PillSeed[], zeroG = this.zeroG) {
    this.zeroG = zeroG;
    this.dragged = null;

    this.pills = seeds.map((seed, index) => ({
      id: seed.id,
      w: seed.width,
      h: seed.height,
      x: seed.x,
      y: seed.y,
      // Evenly spaced headings, so the field never starts moving as one blob.
      vx: zeroG ? Math.cos(index * 2.399) * DRIFT_SPEED : 0,
      vy: zeroG ? Math.sin(index * 2.399) * DRIFT_SPEED : 0,
      angle: 0,
      av: 0,
      supported: false,
    }));

    this.confine();
  }

  get size() {
    return { width: this.width, height: this.height };
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    for (const pill of this.pills) this.confineOne(pill);
  }

  setZeroG(zeroG: boolean) {
    this.zeroG = zeroG;

    if (zeroG) {
      // Give everything a nudge so "off -> on" reads instantly, even when every
      // pill has already settled on the floor.
      for (const pill of this.pills) {
        if (pill.id === this.dragged) continue;
        pill.vx += (Math.random() - 0.5) * 1.2;
        pill.vy += (Math.random() - 0.5) * 1.2;
        pill.av += (Math.random() - 0.5) * 0.6;
      }
    }
  }

  setStill(still: boolean) {
    this.still = still;
  }

  grab(id: string, x: number, y: number) {
    this.dragged = id;
    this.dragTarget = { x, y };
    const pill = this.pills.find((p) => p.id === id);
    if (pill) {
      pill.vx = 0;
      pill.vy = 0;
      pill.av = 0;
    }
  }

  drag(id: string, x: number, y: number) {
    if (this.dragged !== id) return;
    const pill = this.pills.find((p) => p.id === id);
    if (!pill) return;

    const half = this.halfExtents(pill);
    this.dragTarget = {
      x: clamp(x, half.w, Math.max(half.w, this.width - half.w)),
      y: clamp(y, half.h, Math.max(half.h, this.height - half.h)),
    };
  }

  release(id: string, vx = 0, vy = 0) {
    if (this.dragged !== id) return;
    const pill = this.pills.find((p) => p.id === id);
    this.dragged = null;

    if (!pill) return;

    // The fling is measured on the main thread and applied here, exactly once.
    pill.vx = clamp(vx, -26, 26);
    pill.vy = clamp(vy, -26, 26);
    pill.av = clamp(vx * 0.02, -0.6, 0.6);
  }

  setPointer(x: number, y: number) {
    this.pointer = { x, y };
    this.hasPointer = true;
  }

  clearPointer() {
    this.hasPointer = false;
  }

  /** Advance one frame. Returns `null` when nothing moved (nothing to render). */
  step(dt: number): PillState[] | null {
    if (!this.pills.length || !this.width || !this.height) return this.emit();

    const frame = Math.min(dt, 32) / 16.667; // normalise to ~60fps steps

    // Reduced motion: no ambient drift, no gravity, no pointer repulsion — but a
    // drag is user-initiated, so the pill still follows the pointer.
    if (this.still) {
      const dragged = this.pills.find((pill) => pill.id === this.dragged);
      if (!dragged) return null;

      dragged.x += (this.dragTarget.x - dragged.x) * 0.42;
      dragged.y += (this.dragTarget.y - dragged.y) * 0.42;
      this.confineOne(dragged);
      return this.emit();
    }

    if (this.hasPointer) this.repulse(this.pointer.x, this.pointer.y);

    for (let index = 0; index < this.pills.length; index += 1) {
      const pill = this.pills[index];
      // Support was measured at the end of the previous frame; consume it now.
      const supported = pill.supported;
      pill.supported = false;

      if (this.dragged === pill.id) {
        pill.x += (this.dragTarget.x - pill.x) * 0.42;
        pill.y += (this.dragTarget.y - pill.y) * 0.42;
        continue;
      }

      if (this.zeroG) {
        // Weightless drift: almost no damping, plus a speed floor so the arena
        // never settles into a dead still-life.
        pill.vx *= 0.9995;
        pill.vy *= 0.9995;

        const speed = Math.hypot(pill.vx, pill.vy);
        if (speed < DRIFT_FLOOR) {
          // A pill that stopped dead (or was never moving) keeps its heading if
          // it has one, and picks a fresh one otherwise.
          const heading =
            speed > 0.01
              ? Math.atan2(pill.vy, pill.vx)
              : (index * 2.399) % (Math.PI * 2);
          pill.vx = Math.cos(heading) * DRIFT_FLOOR;
          pill.vy = Math.sin(heading) * DRIFT_FLOOR;
        }
      } else if (supported) {
        // Resting on the floor or on another pill: stop feeding it gravity and
        // bleed off the residual creep, otherwise a pile never comes to rest.
        pill.vx *= 0.86;
        pill.vy *= 0.5;
        if (Math.abs(pill.vy) < 0.3) pill.vy = 0;
        if (Math.abs(pill.vx) < 0.04) pill.vx = 0;
      } else {
        pill.vy += 0.075 * frame;
        pill.vx *= 0.988;
        pill.vy *= 0.996;
      }

      pill.x += pill.vx * frame;
      pill.y += pill.vy * frame;

      if (!this.zeroG) this.floor(pill);
      this.walls(pill);

      if (this.zeroG) {
        pill.angle = clamp(pill.angle + pill.av * 0.05 * frame, -MAX_ANGLE, MAX_ANGLE);
      } else {
        pill.angle *= 0.96;
        pill.av *= 0.96;
      }
    }

    this.separate(frame);
    this.confine();
    return this.emit();
  }

  /** Bounce off the floor; a gentle landing counts as support instead. */
  private floor(pill: Body) {
    const half = this.halfExtents(pill);
    const floor = this.height - half.h;
    if (pill.y < floor) return;

    pill.y = floor;

    if (Math.abs(pill.vy) < 0.6) {
      pill.vy = 0;
      pill.vx *= 0.9;
      pill.supported = true;
      return;
    }

    pill.vy *= -0.42;
    pill.vx *= 0.86;
    pill.av *= 0.8;
  }

  /** Bounce off the four walls, using the rotated bounds. */
  private walls(pill: Body) {
    const half = this.halfExtents(pill);
    const maxX = Math.max(half.w, this.width - half.w);
    const maxY = Math.max(half.h, this.height - half.h);

    if (pill.x < half.w) {
      pill.x = half.w;
      pill.vx = Math.abs(pill.vx) * 0.62;
    } else if (pill.x > maxX) {
      pill.x = maxX;
      pill.vx = -Math.abs(pill.vx) * 0.62;
    }

    if (pill.y < half.h) {
      pill.y = half.h;
      pill.vy = Math.abs(pill.vy) * 0.62;
    } else if (pill.y > maxY) {
      pill.y = maxY;
      pill.vy = -Math.abs(pill.vy) * 0.62;
    }
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

        const aFree = this.dragged !== a.id;
        const bFree = this.dragged !== b.id;

        // Resolve on the axis with the smaller penetration.
        if (overlapX < overlapY) {
          const push = (overlapX / 2) * 0.34 * frame;
          const dir = dx === 0 ? (i % 2 === 0 ? 1 : -1) : Math.sign(dx);
          if (aFree) a.x -= push * dir;
          if (bFree) b.x += push * dir;
          if (this.zeroG) {
            const transfer = 0.018 * frame;
            if (aFree) a.vx -= dir * transfer;
            if (bFree) b.vx += dir * transfer;
          } else {
            // Under gravity the overlap is resolved positionally. Bleeding a
            // little horizontal speed here stops two pills that rest against
            // each other from trading pushes forever instead of settling.
            if (aFree) a.vx *= 1 - 0.08 * frame;
            if (bFree) b.vx *= 1 - 0.08 * frame;
          }
        } else {
          const push = (overlapY / 2) * 0.34 * frame;
          const dir = dy === 0 ? (i % 2 === 0 ? 1 : -1) : Math.sign(dy);
          if (aFree) a.y -= push * dir;
          if (bFree) b.y += push * dir;
          if (this.zeroG) {
            const transfer = 0.018 * frame;
            if (aFree) a.vy -= dir * transfer;
            if (bFree) b.vy += dir * transfer;
          } else {
            // Under gravity the pile is resolved positionally: whichever body is
            // on top is resting on the one below, so it must not keep falling.
            if (dir > 0) a.supported = true;
            else b.supported = true;
            if (aFree) a.vx *= 1 - 0.08 * frame;
            if (bFree) b.vx *= 1 - 0.08 * frame;
          }
        }
      }
    }
  }

  /** Pointer repulsion so the arena feels alive without a drag. */
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

  /**
   * Separation moves bodies positionally, so a pill squeezed against a wall can
   * end up a few pixels outside it. Re-apply the wall clamp last so nothing is
   * ever clipped by the arena's overflow.
   */
  private confine() {
    for (const pill of this.pills) this.confineOne(pill);
  }

  private confineOne(pill: Body) {
    const half = this.halfExtents(pill);
    pill.x = clamp(pill.x, half.w, Math.max(half.w, this.width - half.w));
    pill.y = clamp(pill.y, half.h, Math.max(half.h, this.height - half.h));
  }

  /** A rotated pill occupies more space than its width/height. */
  private halfExtents(pill: Body) {
    const cos = Math.abs(Math.cos(pill.angle));
    const sin = Math.abs(Math.sin(pill.angle));
    return {
      w: (pill.w * cos + pill.h * sin) / 2,
      h: (pill.w * sin + pill.h * cos) / 2,
    };
  }

  private emit(): PillState[] {
    return this.pills.map((pill) => ({
      id: pill.id,
      x: pill.x,
      y: pill.y,
      vx: pill.vx,
      vy: pill.vy,
      angle: pill.angle,
      av: pill.av,
    }));
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
