import rn from "random-number";

const stepCount = 400;
const radius = 3;
const pointCount = 500;

var gen = rn.generator({
  min: -5,
  max: 5
});

var colorGen = rn.generator({
  min: 0,
  max: 255,
  integer: true
});

const randomAccelerations = count => {
  const result = new Array(count);

  for (let i = 0; i < count; i++) {
    result[i] = { x: gen(), y: gen() };
  }
  return result;
};

const point = () => ({
  pos: { x: 250, y: 250 },
  vel: { x: 0, y: 0 },
  step: 0,
  startR: colorGen(),
  startG: colorGen(),
  startB: colorGen(),
  endR: colorGen(),
  endG: colorGen(),
  endB: colorGen(),
  accelerations: randomAccelerations(stepCount)
});

const points = new Array(pointCount);
for (let i = 0; i < pointCount; i++) {
  points[i] = point();
}

const addVectors = (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y });

const rgb = (r, g, b) => `rgb(${r},${g},${b})`;

const step = point => {
  point.vel = addVectors(point.accelerations[point.step], point.vel);
  if (point.vel.x < -5) point.vel.x = -5;
  if (point.vel.x > 5) point.vel.x = 5;
  if (point.vel.y < -5) point.vel.y = -5;
  if (point.vel.y > 5) point.vel.y = 5;
  point.pos = addVectors(point.pos, point.vel);
  point.step++;
};

const draw = () => {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    for (let k = 0; k < pointCount; k++) {
      for (let i = 0; i < stepCount; i++) {
        ctx.beginPath();
        ctx.arc(points[k].pos.x, points[k].pos.y, radius, 0, Math.PI * 2, true);
        const pctDone = points[k].step / stepCount;
        const r = Math.round(
          points[k].startR + pctDone * (points[k].endR - points[k].startR)
        );
        const g = Math.round(
          points[k].startG + pctDone * (points[k].endG - points[k].startG)
        );
        const b = Math.round(
          points[k].startB + pctDone * (points[k].endB - points[k].startB)
        );
        ctx.fillStyle = rgb(r, g, b);
        ctx.fill();
        ctx.stroke();
        step(points[k]);
      }
    }
  }
};

document.getElementById("app").innerHTML = `
<canvas id="canvas" height="500" width="500">
 
</canvas>
`;

draw();
