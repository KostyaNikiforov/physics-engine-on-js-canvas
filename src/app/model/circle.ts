import {Shape, ShapeType} from "./shape";
import {Vector2} from "../common/util/model/vector2";
import {MathUtil} from "../common/math.util";
import {MaterialType} from "./material";
import {LifeCircleService} from "../service/life-circle.service";
import {FULL_CIRCLE} from "../service/rendar/drawing.service";
import {COLORS} from "../common/colors";
import {PhysicUtil} from "../common/physic.util";

export class Circle extends Shape {
  private _rotation: number;
  radius: number;
  square: number;
  circuit: number;
  color: string;

  constructor(
    position: Vector2,
    radius: number,
    speed: number,
    direction: Vector2,
    materialType: MaterialType = MaterialType.METAL
  ) {
    super(
      position,
      ShapeType.circle,
      speed,
      direction,
      PhysicUtil.calculateCircleMass(radius, materialType),
    );

    this._rotation = 0;
    this.radius = radius;
    this.square = MathUtil.getCircleSquare(radius);
    this.circuit = MathUtil.getCircleCircuit(radius);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  setRotationSpeed(speed: number): void {
    this.rotationSpeed
      = FULL_CIRCLE * (speed / this.circuit)  * LifeCircleService.timeStepPerFrame
  }

  override rotate(): void {
    this.rotation += this.rotationSpeed
  }

  override move(): void {
    this.centerPosition.x += this.velocity.x * LifeCircleService.timeStepPerFrame;
    this.centerPosition.y += this.velocity.y * LifeCircleService.timeStepPerFrame;
  }

  get rotation(): number {
    return this._rotation;
  }

  set rotation(number: number) {
    this._rotation = number;
  }
}
