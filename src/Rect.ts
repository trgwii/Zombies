import { Vec2 } from "./Vec2.js";

export class Rect {
  pos: Vec2;
  dim: Vec2;
  halfDim: Vec2;
  min: Vec2;
  max: Vec2;
  constructor(x: number, y: number, w: number, h: number) {
    this.pos = new Vec2(x, y);
    this.dim = new Vec2(w, h);
    this.halfDim = this.dim.div(2);
    this.min = this.pos.sub(this.halfDim);
    this.max = this.pos.add(this.halfDim);
  }
  clone() {
    return new Rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }
  moveAndSlide(entities: Rect[]) {
  }
  updatePos(pos: Vec2) {
    this.pos = pos;
    this.min = this.pos.sub(this.halfDim);
    this.max = this.pos.add(this.halfDim);
  }
  updateDim(dim: Vec2) {
    this.dim = dim;
    this.halfDim = this.dim.div(2);
    this.min = this.pos.sub(this.halfDim);
    this.max = this.pos.add(this.halfDim);
  }
  static fromPos(pos: Vec2, w: number, h: number) {
    return new Rect(pos.x, pos.y, w, h);
  }
  static fromPosDim(pos: Vec2, dim: Vec2) {
    return new Rect(pos.x, pos.y, dim.x, dim.y);
  }
  add(dim: Vec2) {
    return new Rect(
      this.pos.x,
      this.pos.y,
      this.dim.x + dim.x,
      this.dim.y + dim.y,
    );
  }
  isInRect(p: Vec2) {
    return (
      p.x <= this.max.x &&
      p.x >= this.min.x &&
      p.y <= this.max.y &&
      p.y >= this.min.y
    );
  }
  intersects(r: Rect) {
    return r.isInRect(this.pos);
  }
}
