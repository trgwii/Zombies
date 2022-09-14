import type { Input } from "./engine.js";
import { Vec2 } from "./Vec2.js";
import { Rect } from "./Rect.js";
import { Renderer } from "./renderer.js";

const pixelsPerMeter = 20;

let player = new Rect(0, 0, 1, 2);

const camera = new Vec2(0, 0);

const entities = [
  player,
  new Rect(10, 10, 5, 5),
  new Rect(2, 8, 10, 5),
  new Rect(0, -15, 30, 1),
  new Rect(0, 15, 30, 1),
  new Rect(-15, 0, 1, 30),
  new Rect(15, 0, 1, 30),
];

const renderer = new Renderer(camera, pixelsPerMeter);

const moveAndSlide = (rect: Rect, move: Vec2, entities: Rect[]) => {
  if (move.x === 0 && move.y === 0) return;
  let m = move.clone();
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    if (e === rect) continue;
    if (e.add(rect.dim).isInRect(rect.pos.add(m.setX(0)))) m = m.setY(0);
    if (e.add(rect.dim).isInRect(rect.pos.add(m.setY(0)))) m = m.setX(0);
  }

  rect.updatePos(rect.pos.add(m));
};
const moveAndBounce = (rect: Rect, move: Vec2, entities: Rect[]) => {
  if (move.x === 0 && move.y === 0) return move;
  let m = move.clone();
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    if (e === rect) continue;
    if (e.add(rect.dim).isInRect(rect.pos.add(m.setX(0)))) m = m.setY(-m.y);
    if (e.add(rect.dim).isInRect(rect.pos.add(m.setY(0)))) m = m.setX(-m.x);
  }

  rect.updatePos(rect.pos.add(m));
  return m;
};

let prev = new Vec2(0, 0);

export const updateAndRender = (
  ctx: CanvasRenderingContext2D,
  delta: number,
  input: Input,
) => {
  const move = new Vec2(
    Number(input.right.pressed) - Number(input.left.pressed),
    Number(input.down.pressed) - Number(input.up.pressed),
  ).normalize().mul(delta * 1);

  prev = moveAndBounce(player, move.isZero() ? prev : move, entities);
  // moveAndSlide(player, move, entities);

  if (input.run.pressed) {
    player.updateDim(player.dim.add(new Vec2(.1, .1)));
  }
  if (input.crouch.pressed) {
    const newDim = player.dim.sub(new Vec2(.1, .1));
    if (newDim.x > 0 && newDim.y > 0) {
      player.updateDim(newDim);
    }
  }

  renderer.clear(ctx);
  for (let i = 0; i < entities.length; i++) {
    renderer.drawRect(ctx, entities[i], "blue");
  }
};
