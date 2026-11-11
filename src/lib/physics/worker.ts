/// <reference lib="webworker" />

import { PillWorld, type WorkerIn } from "@/lib/physics/world";

/**
 * DedicatedWorkers have no requestAnimationFrame in most browsers, so the main
 * thread owns the clock and posts a `step` message each frame. The worker keeps
 * the simulation state and returns positions.
 */
const world = new PillWorld((message) => {
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(message);
});

self.addEventListener("message", (event: MessageEvent<WorkerIn>) => {
  const message = event.data;

  switch (message.type) {
    case "init":
      world.init(message.width, message.height, message.pills, message.zeroG);
      break;
    case "resize":
      world.resize(message.width, message.height);
      break;
    case "grab":
      world.grab(message.id, message.pointerX, message.pointerY);
      break;
    case "drag":
      world.drag(message.id, message.pointerX, message.pointerY);
      break;
    case "pointer":
      world.setPointer(message.x, message.y);
      break;
    case "pointer-leave":
      world.clearPointer();
      break;
    case "release":
      world.release(message.id);
      break;
    case "toggle":
      world.setZeroG(message.zeroG);
      break;
    case "pause":
      world.pause(message.paused);
      break;
    case "kick":
      world.kick(message.id, message.vx, message.vy);
      break;
    case "step":
      world.step(message.dt);
      break;
    default:
      break;
  }
});
