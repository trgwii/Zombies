import { Vec2 } from "./Vec2.js";
import type { Rect } from "./Rect.js";

export class Renderer {
  constructor(
    readonly camera: Vec2,
    readonly scale: number,
  ) {}
  clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  drawRect(ctx: CanvasRenderingContext2D, r: Rect, style: string) {
    const renderOffset = new Vec2(
      ctx.canvas.width,
      ctx.canvas.height,
    ).div(2).add(this.camera);

    const pixelPos = r.min.mul(this.scale).add(renderOffset);
    const pixelDim = r.dim.mul(this.scale);

    ctx.fillStyle = style;
    ctx.fillRect(pixelPos.x, pixelPos.y, pixelDim.x, pixelDim.y);
  }
}
