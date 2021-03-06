const IDEAL_RESOLUTION = { width: 1024, height: 768 };
const MAX_CANVAS_SCALING = 2;
const SCALE_DELTA = 0.1;
const RESIZE_TRIGGER_DEBOUNCING = 250;

export function create(canvasEl) {
  const bestBufferSize = getBestBufferSize();
  resize(canvasEl, bestBufferSize);

  window.addEventListener(
    'resize',
    debounce(() => {
      const bestBufferSize = getBestBufferSize();
      resize(canvasEl, bestBufferSize);
    }, RESIZE_TRIGGER_DEBOUNCING)
  );

  return canvasEl;
}

function maxBufferSize() {
  const multiplier = window.devicePixelRatio;
  return {
    width: Math.floor(window.innerWidth * multiplier),
    height: Math.floor(window.innerHeight * multiplier),
  };
}

function calculateMaxUnscaledBuffer(a, b) {
  return {
    width: Math.min(a.width, b.width),
    height: Math.min(a.height, b.height),
  };
}

// To improve performance, the canvas resolution can be scaled down.
// There is a maximum amount of scaling allowed so that
// the graphics won't get too blurry, and the scaling factor adaptive,
// transitioning between no scaling and the maximum.

// This function calculates the best size for the current canvas buffer,
// based on the current resolution, the devide pixel ratio and the
// maximum amount of scaling allowed.
function getBestBufferSize() {
  // Displays with the ideal resolution or less should not be scaled.
  // So below the ideal resolution we show graphics on the canvas at 1 to 1.
  // At the same time, we don't want to use buffers that are bigger
  // than necessary, so we limit the buffer to the maximum we need.
  const maxUnscaledBuffer = calculateMaxUnscaledBuffer(
    IDEAL_RESOLUTION,
    maxBufferSize()
  );

  // This is the minimum size buffer based on how much we're willing to scale.
  // Basically this is the buffer that would give us the maximum blurryness
  // that we can accept.
  // If this buffer is bigger than the ideal resolution maximally scaled then
  // this is what will be used.
  let scaledCanvasWidth = Math.floor(window.innerWidth / MAX_CANVAS_SCALING);
  let scaledCanvasHeight = Math.floor(window.innerHeight / MAX_CANVAS_SCALING);

  // Starting with maximum scaling, check if that buffer resolution is within
  // the acceptable limits. If it is then decrease the scaling factor and carry
  // on checking. If it's not then exit the loop and use the last acceptable
  // buffer size.
  let scaling = MAX_CANVAS_SCALING;
  while (scaling > 1) {
    const sW = Math.floor(window.innerWidth / (scaling - SCALE_DELTA));
    const sH = Math.floor(window.innerHeight / (scaling - SCALE_DELTA));

    if (sW > maxUnscaledBuffer.width || sH > maxUnscaledBuffer.height) {
      break;
    }

    scaledCanvasWidth = sW;
    scaledCanvasHeight = sH;
    scaling = scaling - SCALE_DELTA;
  }

  return {
    width: scaledCanvasWidth,
    height: scaledCanvasHeight,
    scaling: scaling,
  };
}

function resize(canvasElement, { width, height, scaling }) {
  canvasElement.width = window.innerWidth / scaling;
  canvasElement.height = window.innerHeight / scaling;

  canvasElement.style.width = width + 'px';
  canvasElement.style.height = height + 'px';
  canvasElement.style['transform-origin'] = '0% 0%';
  canvasElement.style.transform = `scale(${scaling}, ${scaling})`;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
