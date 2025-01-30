import {Position} from "../common/util/model/position";
import {Vector2} from "../common/util/model/vector2";
import {LifeCircleService} from "../service/world/life-circle.service";

export class Shape {
  position: Position;
  readonly type: ShapeType;
  readonly mass: number;
  velocity: Vector2;
  rotation: number;
  rotationSpeedAngle: number;

  constructor(
    position: Position,
    type: ShapeType,
    speed: number,
    direction: Vector2,
    mass: number,
  ) {
    this.position = position;
    this.type = type;
    this.mass = mass;
    this.rotation = 0;
    this.rotationSpeedAngle = 0;

    this.velocity = {
      x: speed * direction.x,
      y: speed * direction.y,
    };
  }

  move(): void {
    this.position.x += this.velocity.x * LifeCircleService.timeStepPerFrame;
    this.position.y += this.velocity.y * LifeCircleService.timeStepPerFrame;
    console.log(this.position.y);
  }
}

export enum ShapeType {
  circle = 'circle',
  polygon = 'polygon',
}
