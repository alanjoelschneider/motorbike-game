export default class VerletPoint {
  protected px: number;
  protected py: number;
  protected fx: number = 0;
  protected fy: number = 0;

  constructor(public x: number, public y: number, protected friction: number) {
    this.px = x;
    this.py = y;
  }

  public update(dt: number) {
    let vx = this.x - this.px;
    let vy = this.y - this.py;

    this.px = this.x;
    this.py = this.y;

    vx *= 1 - this.friction;
    vy *= 1 - this.friction;

    this.x = this.x + vx + this.fx * dt;
    this.y = this.y + vy + this.fy * dt;

    this.fx = 0;
    this.fy = 0;
  }

  public applyForce(fx: number, fy: number) {
    this.fx += fx;
    this.fy += fy;
  }

  public getVx() {
    return this.x - this.px;
  }

  public getVy() {
    return this.y - this.py;
  }
}
