//@ts-check
/** @type {(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number) => void} */
const draw = (ctx, color, x, y, width, height) => {
  ctx.fillStyle = color;
  ctx.fillRect(x - (width / 2), y - (height / 2), width, height);
};

class Vec2 {
  /** @type {number} */
  x;
  /** @type {number} */
  y;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  add(/** @type {Vec2} */ v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  mul(/** @type {number} */ n) {
    this.x *= n;
    this.y *= n;
    return this;
  }
  div(/** @type {number} */ n) {
    if (this.x !== 0) this.x /= n;
    if (this.y !== 0) this.y /= n;
    return this;
  }
  normalize() {
    return this.div(this.len());
  }
}

/**
 * @typedef Entity
 * @prop {string} color
 * @prop {Vec2} pos
 * @prop {number} width
 * @prop {number} height
 */

/**
 * @typedef Input
 * @prop {boolean} up
 * @prop {boolean} left
 * @prop {boolean} down
 * @prop {boolean} right
 */

/** @type {Entity[]} */
const entities = [];

const camera = new Vec2();

/** @type {(entity: Entity, movement: Vec2, entities: Entity[]) => Vec2} */
const collide = (entity, movement, entities) => {
  const changedPos = new Vec2(entity.pos.x, entity.pos.y).add(movement);
  for (let i = 0; i < entities.length; i++) {
    const target = entities[i];
    if (target === entity) continue;
    if (
      changedPos.x >= target.pos.x - target.width / 2 &&
      changedPos.x <= target.pos.x + target.width / 2 &&
      changedPos.y >= target.pos.y - target.height / 2 &&
      changedPos.y <= target.pos.y + target.height / 2
    ) {
      return new Vec2(0, 0);
    }
  }
  return movement;
};

/** @type {(ctx: CanvasRenderingContext2D, delta: number, input: Input) => void} */
export const updateAndRender = (ctx, delta, input) => {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  /** @type {Entity} */
  if (entities.length === 0) {
    const player = {
      color: "red",
      pos: new Vec2(width / 2, height / 2),
      width: 20,
      height: 40,
    };
    entities.push(player);

    entities.push({
      color: "blue",
      pos: new Vec2(100, 100),
      width: 200,
      height: 100,
    });

    entities.push({
      color: "gray",
      pos: new Vec2(400, 100),
      width: 200,
      height: 100,
    });

    entities.push({
      color: "brown",
      pos: new Vec2(200, 600),
      width: 100,
      height: 600,
    });
  }
  const player = entities.find((x) => x.color === "red");
  if (!player) throw new Error("Missing player");

  // Y sort
  entities.sort((a, b) => a.pos.y < b.pos.y ? -1 : b.pos.y < a.pos.y ? 1 : 0);

  const movement = collide(
    player,
    new Vec2(
      Number(input.right) - Number(input.left),
      Number(input.down) - Number(input.up),
    ).normalize().mul(100 * delta),
    entities,
  );

  player.pos.add(movement);
  camera.add(movement);

  for (const entity of entities) {
    draw(
      ctx,
      entity.color,
      entity.pos.x - camera.x,
      entity.pos.y - camera.y,
      entity.width,
      entity.height,
    );
  }
};
