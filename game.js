//@ts-check
/** @type {(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number) => void} */
const draw = (ctx, color, x, y, width, height) => {
  ctx.fillStyle = color;
  ctx.fillRect(x - (width / 2), y - (height / 2), width, height);
};

/** @type {(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, v: Vec2) => void} */
const drawVec = (ctx, color, x, y, v) => {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + v.x, y + v.y);
  ctx.stroke();
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
 * @prop {Vec2} direction
 * @prop {number} width
 * @prop {number} height
 * @prop {number} depth
 * @prop {boolean} massive
 */

/**
 * @typedef Input
 * @prop {boolean} up
 * @prop {boolean} left
 * @prop {boolean} down
 * @prop {boolean} right
 * @prop {boolean} fire
 * @prop {number} mouseX
 * @prop {number} mouseY
 * @prop {boolean} speed
 */

/** @type {Entity[]} */
const entities = [];

const camera = new Vec2();

/** @type {(x: number, y: number, width: number, depth: number, target: Entity) => boolean} */
const intersects = (x, y, width, depth, target) =>
  x >= target.pos.x - target.width / 2 - width / 2 &&
  x <= target.pos.x + target.width / 2 + width / 2 &&
  y >= target.pos.y - target.depth / 2 - depth / 2 &&
  y <= target.pos.y + target.depth / 2 + depth / 2;

/** @type {(entity: Entity, movement: Vec2, entities: Entity[]) => Vec2} */
const collide = (entity, movement, entities) => {
  const changedPos = new Vec2(entity.pos.x, entity.pos.y).add(movement);
  for (let i = 0; i < entities.length; i++) {
    const target = entities[i];
    if (target === entity) continue;
    if (!target.massive) continue;
    if (
      intersects(
        changedPos.x,
        changedPos.y,
        entity.width,
        entity.depth,
        target,
      )
    ) {
      if (
        !intersects(
          entity.pos.x,
          changedPos.y,
          entity.width,
          entity.depth,
          target,
        )
      ) {
        return collide(entity, new Vec2(0, movement.y), entities);
      }
      if (
        !intersects(
          changedPos.x,
          entity.pos.y,
          entity.width,
          entity.depth,
          target,
        )
      ) {
        return collide(entity, new Vec2(movement.x, 0), entities);
      }
      return new Vec2(0, 0);
    }
  }
  return movement;
};

/** @type {(ctx: CanvasRenderingContext2D, delta: number, input: Input) => void} */
export const updateAndRender = (ctx, delta, input) => {
  const { width, height } = ctx.canvas;
  /** @type {Entity} */
  if (entities.length === 0) {
    const player = {
      color: "red",
      pos: new Vec2(600, 600),
      direction: new Vec2(0, 0),
      width: 20,
      height: 40,
      depth: 20,
      health: 100,
      massive: true,
    };
    entities.push(player);

    entities.push({
      color: "dimgray",
      pos: new Vec2(-1000, -1000),
      direction: new Vec2(0, 0),
      width: 100,
      height: 4000,
      depth: 4000,
      massive: true,
    });
    entities.push({
      color: "dimgray",
      pos: new Vec2(1000, -3000),
      direction: new Vec2(0, 0),
      width: 4000,
      height: 100,
      depth: 100,
      massive: true,
    });
    entities.push({
      color: "dimgray",
      pos: new Vec2(3000, -1000),
      direction: new Vec2(0, 0),
      width: 100,
      height: 4000,
      depth: 4000,
      massive: true,
    });
    entities.push({
      color: "dimgray",
      pos: new Vec2(1000, 1000),
      direction: new Vec2(0, 0),
      width: 4000,
      height: 100,
      depth: 100,
      massive: true,
    });

    entities.push({
      color: "blue",
      pos: new Vec2(100, 100),
      direction: new Vec2(0, 0),
      width: 200,
      height: 100,
      depth: 100,
      massive: true,
    });

    entities.push({
      color: "gray",
      pos: new Vec2(1400, 200),
      direction: new Vec2(0, 0),
      width: 200,
      height: 100,
      depth: 100,
      massive: true,
    });

    entities.push({
      color: "gray",
      pos: new Vec2(400, 400),
      direction: new Vec2(0, 0),
      width: 200,
      height: 100,
      depth: 100,
      massive: true,
    });

    entities.push({
      color: "brown",
      pos: new Vec2(200, 600),
      direction: new Vec2(0, 0),
      width: 100,
      height: 600,
      depth: 580,
      massive: true,
    });

    entities.push({
      color: "blue",
      pos: new Vec2(100, 100),
      direction: new Vec2(0, 0),
      width: 200,
      height: 100,
      depth: 100,
      massive: true,
    });

    entities.push({
      color: "gray",
      pos: new Vec2(400, 100),
      direction: new Vec2(0, 0),
      width: 200,
      height: 100,
      depth: 100,
      massive: true,
    });

    entities.push({
      color: "gray",
      pos: new Vec2(400, 400),
      direction: new Vec2(0, 0),
      width: 200,
      height: 100,
      depth: 100,
      massive: true,
    });

    entities.push({
      color: "brown",
      pos: new Vec2(200, 600),
      direction: new Vec2(0, 0),
      width: 100,
      height: 600,
      depth: 580,
      massive: true,
    });

    entities.push({
      color: "green",
      pos: new Vec2(1200, 800),
      direction: new Vec2(0, 0),
      width: 20,
      height: 40,
      depth: 35,
      massive: true,
    });
    entities.push({
      color: "green",
      pos: new Vec2(1200, 100),
      direction: new Vec2(0, 0),
      width: 20,
      height: 40,
      depth: 35,
      massive: true,
    });
  }

  const player = entities.find((x) => x.color === "red");
  const enemies = entities.filter((x) => x.color === "green");
  const bullets = entities.filter((x) => x.color === "orange");
  if (!player) throw new Error("Missing player");

  if (Math.random() < 0.1) {
    const desiredPos = new Vec2(
      (Math.random() < 0.5 ? -1500 : 1500) + 600,
      (Math.random() < 0.5 ? -1500 : 1500) - 600,
    );
    let collides = false;
    for (const entity of entities) {
      if (intersects(desiredPos.x, desiredPos.y, 20, 20, entity)) {
        collides = true;
      }
    }
    if (!collides) {
      entities.push({
        color: "green",
        pos: desiredPos,
        direction: new Vec2(0, 0),
        width: 20,
        height: 40,
        depth: 35,
        massive: true,
      });
    }
  }

  // Y sort
  entities.sort((a, b) => a.pos.y < b.pos.y ? -1 : b.pos.y < a.pos.y ? 1 : 0);

  const playerMovement = collide(
    player,
    new Vec2(
      Number(input.right) - Number(input.left),
      Number(input.down) - Number(input.up),
    ).normalize().mul((input.speed ? 1000 : 100) * delta),
    entities,
  );

  player.pos.add(playerMovement);

  if (input.fire) {
    const mouseDirection = new Vec2(
      input.mouseX + camera.x - player.pos.x,
      input.mouseY + camera.y - player.pos.y,
    ).normalize();
    entities.push({
      color: "orange",
      pos: new Vec2(
        player.pos.x + (mouseDirection.x * 20),
        player.pos.y + mouseDirection.y * 20,
      ),
      direction: mouseDirection,
      width: 3,
      height: 3,
      depth: 3,
      massive: false,
    });
  }

  if (playerMovement.x !== 0 || playerMovement.y !== 0) {
    player.direction = playerMovement;
  }
  camera.x = player.pos.x - (width / 2);
  camera.y = player.pos.y - (height / 2);

  for (const bullet of bullets) {
    if (
      new Vec2(bullet.pos.x - player.pos.x, bullet.pos.y - player.pos.y).len() >
        3000
    ) {
      entities.splice(entities.indexOf(bullet), 1);
      continue;
    }
    const m = new Vec2(bullet.direction.x, bullet.direction.y).mul(800 * delta);
    const movement = collide(bullet, m, entities);
    if (movement.x === 0 && movement.y === 0) {
      for (const enemy of enemies) {
        const targetPos = new Vec2(bullet.pos.x, bullet.pos.y).add(m);
        if (
          intersects(
            targetPos.x,
            targetPos.y,
            bullet.width,
            bullet.height,
            enemy,
          )
        ) {
          entities.splice(entities.indexOf(enemy), 1);
        }
      }
      entities.splice(entities.indexOf(bullet), 1);
      continue;
    }
    bullet.pos.add(movement);
  }

  for (const enemy of enemies) {
    const targetMovement = new Vec2(
      player.pos.x - enemy.pos.x,
      player.pos.y - enemy.pos.y,
    ).normalize().mul(80 * delta);
    const movement = collide(enemy, targetMovement, entities);
    enemy.pos.add(movement);
    enemy.direction = movement;
    const targetPos = new Vec2(enemy.pos.x, enemy.pos.y).add(targetMovement);
    if (
      intersects(targetPos.x, targetPos.y, enemy.width, enemy.depth, player)
    ) {
      player.health -= 1;
      if (player.health <= 0) {
        player.health = 0;
        location.reload();
      }
    }
  }

  ctx.clearRect(0, 0, width, height);
  for (const entity of entities) {
    draw(
      ctx,
      entity.color,
      entity.pos.x - camera.x,
      entity.pos.y - camera.y,
      entity.width,
      entity.height,
    );
    if (entity.color === "green") {
      drawVec(
        ctx,
        "pink",
        entity.pos.x - camera.x,
        entity.pos.y - camera.y,
        entity.direction.mul(10),
      );
    }
  }
  drawVec(
    ctx,
    "pink",
    width / 2,
    height / 2,
    playerMovement.mul(10),
  );
  drawVec(
    ctx,
    "purple",
    width / 2,
    height / 2,
    new Vec2(
      input.mouseX + camera.x - player.pos.x,
      input.mouseY + camera.y - player.pos.y,
    ),
  );
  ctx.fillStyle = "#660000";
  ctx.font = "24px monospace";
  const text = [
    input.speed ? "⥅" : "",
    input.left ? "🡸" : "",
    input.up ? "🡹" : "",
    input.down ? "🡻" : "",
    input.right ? "🡺" : "",
    input.fire ? "🔫" : "",
  ].join("");
  ctx.fillText(
    text,
    width / 2 - (text.length / 4) * 24,
    height / 2 + 48,
  );
  draw(
    ctx,
    "brown",
    width / 2,
    height / 2 + 48 + 24,
    100,
    10,
  );
  draw(
    ctx,
    "red",
    width / 2,
    height / 2 + 48 + 24,
    player.health,
    10,
  );
};
