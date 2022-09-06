import { updateAndRender } from "./game.js";

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("Missing canvas");
const ctx = canvas.getContext("2d", { alpha: false });
if (!ctx) throw new Error("Missing ctx");

const onResize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};
onResize();
addEventListener("resize", onResize);

let time = 0;

const input = {
  up: false,
  left: false,
  down: false,
  right: false,
  fire: false,
  mouseX: 0,
  mouseY: 0,
  speed: false,
};

addEventListener("mousemove", (e) => {
  input.mouseX = e.clientX;
  input.mouseY = e.clientY;
});

addEventListener("mousedown", (e) => {
  if (e.button === 0) input.fire = true;
});

addEventListener("mouseup", (e) => {
  if (e.button === 0) input.fire = false;
});

addEventListener("keydown", (e) => {
  if (["w", "W", "ArrowUp"].includes(e.key)) input.up = true;
  if (["a", "A", "ArrowLeft"].includes(e.key)) input.left = true;
  if (["s", "S", "ArrowDown"].includes(e.key)) input.down = true;
  if (["d", "D", "ArrowRight"].includes(e.key)) input.right = true;
  if ([" "].includes(e.key)) input.fire = true;
  if (["Shift"].includes(e.key)) input.speed = true;
});
addEventListener("keyup", (e) => {
  if (["w", "W", "ArrowUp"].includes(e.key)) input.up = false;
  if (["a", "A", "ArrowLeft"].includes(e.key)) input.left = false;
  if (["s", "S", "ArrowDown"].includes(e.key)) input.down = false;
  if (["d", "D", "ArrowRight"].includes(e.key)) input.right = false;
  if ([" "].includes(e.key)) input.fire = false;
  if (["Shift"].includes(e.key)) input.speed = false;
});

/** @type {(time: number) => void} */
const loop = (t) => {
  const delta = (t - time) / 1000;
  time = t;
  updateAndRender(ctx, delta, input);
  requestAnimationFrame(loop);
};
loop(0);
