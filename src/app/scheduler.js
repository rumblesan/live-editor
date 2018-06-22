export function create() {
  return {
    running: true,
    scheduledAnimationFuncs: [],
  };
}

export function start(scheduler) {
  if (scheduler.running) return;

  scheduler.running = true;
  const loop = () => {
    scheduler.scheduledAnimationFuncs.forEach(func => func());
    if (scheduler.running) {
      window.requestAnimationFrame(loop);
    }
  };
  window.requestAnimationFrame(loop);
}

export function stopAnimation(scheduler) {
  scheduler.running = false;
}

export function clearAnimation(scheduler) {
  scheduler.scheduledAnimationFuncs = [];
}

export function addAnimation(scheduler, func) {
  scheduler.scheduledAnimationFuncs.push(func);
}

export function nextFrame(scheduler, func) {
  window.requestAnimationFrame(func);
}
