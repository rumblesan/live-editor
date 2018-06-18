export function create(canvas) {
  return {
    canvas,
    ctx: canvas.getContext('2d'),
  };
}

export function clear(drawLib) {
  const {
    ctx,
    canvas: { width, height },
  } = drawLib;
  ctx.clearRect(0, 0, width, height);
}

export function drawLine(drawLib, x1, y1, x2, y2, colour) {
  const {
    ctx,
    canvas: { width, height },
  } = drawLib;
  if (colour) {
    ctx.strokeStyle = colour;
  } else {
    ctx.strokeStyle = 'black';
  }
  ctx.beginPath();
  ctx.moveTo(x1 * width, y1 * height);
  ctx.lineTo(x2 * width, y2 * height);
  ctx.stroke();
}

export function drawRect(drawLib, x1, y1, x2, y2, colour) {
  const {
    ctx,
    canvas: { width, height },
  } = drawLib;
  if (colour) {
    ctx.fillStyle = colour;
  } else {
    ctx.fillStyle = 'black';
  }
  ctx.fillRect(x1 * width, y1 * height, x2 * width, y2 * height);
}
