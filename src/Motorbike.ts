import VerletPoint from './VerletPoint';

export default class Motorbike extends VerletPoint {
  public rotation: number = 0;
  private prevRotation: number = 0;
  private angularForce: number = 0;

  constructor(x: number, y: number, public radius: number, friction: number) {
    super(x, y, friction);
  }

  public update(dt: number): void {
    super.update(dt);

    let angularVelocity = this.rotation - this.prevRotation;
    this.prevRotation = this.rotation;

    angularVelocity *= 1 - this.friction;
    this.rotation = this.rotation + angularVelocity + this.angularForce * dt;

    this.angularForce = 0;
  }

  public applyAngularForce(angularForce: number) {
    this.angularForce += angularForce;
  }

  public render(ctx: CanvasRenderingContext2D, image: HTMLImageElement, clampX?: number, clampY?: number) {
    ctx.save();
    ctx.translate(~~(clampX ?? this.x), ~~(clampY ?? this.y));
    ctx.rotate(this.rotation);
    ctx.drawImage(image, -this.radius * 2, -this.radius * 1.5, this.radius * 4, this.radius * 2.75);
    ctx.restore();
  }
}
