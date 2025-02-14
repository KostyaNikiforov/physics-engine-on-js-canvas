import {Shape} from "./shape";
import {Vector2} from "../../common/util/model/vector2";
import { MaterialType} from "../material";
import {LifeCircleService} from "../../service/life-circle.service";
import {PhysicUtil} from "../../common/util/physic.util";
import {ShapeType} from "./property";
import {ShapeUtil} from "../../common/util/shape.util";

export class Square extends Shape {
  private readonly _size: number;
  private readonly _points: Vector2[];

  constructor(
    centerPosition: Vector2,
    size: number,
    speed: number,
    direction: Vector2,
    materialType: MaterialType = MaterialType.METAL
  ) {
    super(
      centerPosition,
      ShapeType.square,
      speed,
      direction,
      PhysicUtil.calculateSquareMass(size, materialType),
    );

    this._size = size;
    this._points = ShapeUtil.calculateSquarePoints(centerPosition, size);
  }

  override rotateOn(degrees: number): void {
    this.points.forEach((point: Vector2): void => {
      const x: number = point.x - this.rotation.point.x;
      const y: number = point.y - this.rotation.point.y;

      const cos: number = Math.cos(degrees * LifeCircleService.timeStepPerFrame);
      const sin: number = Math.sin(degrees * LifeCircleService.timeStepPerFrame);

      point.x = this.rotation.point.x + x * cos - y * sin;
      point.y = this.rotation.point.y + x * sin + y * cos;
    })
  }

  override moveOn(vector: Vector2): void {
    this.position.x += vector.x;
    this.position.y += vector.y;

    this.rotation.point.x += vector.x;
    this.rotation.point.y += vector.y;

    this.points.forEach((point: Vector2): void => {
      point.x += vector.x;
      point.y += vector.y;
    })
  }

  get size(): number {
    return this._size;
  }

  get points(): Vector2[] {
    return this._points;
  }
}
