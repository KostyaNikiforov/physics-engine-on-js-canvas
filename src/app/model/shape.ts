import {Vector2} from "../common/util/model/vector2";
import {normalizeVector} from "../common/util/vector.util";
import {MathUtil} from "../common/math.util";

export type Rotation = {
  speed: number;
  point: Vector2;
};

export abstract class Shape {
  readonly type: ShapeType;
  readonly mass: number;
  private _rotationSpeed: number; // Radiant per second
  centerPosition: Vector2;
  velocity: Vector2;

  constructor(
    position: Vector2,
    type: ShapeType,
    speed: number,
    direction: Vector2,
    mass: number,
  ) {
    this.centerPosition = position;
    this.type = type;
    this.mass = mass;
    this._rotationSpeed = 0;

    this.velocity = {
      x: speed * direction.x,
      y: speed * direction.y,
    };
  }

  // TODO: cache this value
  direction(): Vector2 {
    return normalizeVector(this.velocity);
  }

  abstract rotate(): void;

  abstract move(): void;

  set rotationSpeed(number: number) {
    this._rotationSpeed = MathUtil.degreesToRadians(number);
  }

  get rotationSpeed(): number {
    return this._rotationSpeed;
  }
}

export enum ShapeType {
  circle = 'circle',
  square = 'square',
}
