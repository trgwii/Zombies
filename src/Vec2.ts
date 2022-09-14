export class Vec2 {
  constructor(readonly x = 0, readonly y = 0) {}
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  clone() {
    return new Vec2(this.x, this.y);
  }
  setX(x: number) {
    return new Vec2(x, this.y);
  }
  setY(y: number) {
    return new Vec2(this.x, y);
  }
  lenSquared() {
    return this.dot(this);
  }
  len() {
    return Math.sqrt(this.lenSquared());
  }
  add(v: Vec2) {
    return new Vec2(
      this.x + v.x,
      this.y + v.y,
    );
  }
  sub(v: Vec2) {
    return new Vec2(
      this.x - v.x,
      this.y - v.y,
    );
  }
  mul(n: number) {
    return new Vec2(
      this.x * n,
      this.y * n,
    );
  }
  div(n: number) {
    return new Vec2(
      this.x === 0 ? 0 : this.x / n,
      this.y === 0 ? 0 : this.y / n,
    );
  }
  normalize() {
    return this.div(this.len());
  }
  dot(v: Vec2) {
    return this.x * v.x + this.y * v.y;
  }
}
