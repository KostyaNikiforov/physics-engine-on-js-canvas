import {Shape, ShapeType} from "./shape";
import {Vector2} from "../../common/util/model/vector2";
import { MaterialType} from "../material";
import {LifeCircleService} from "../../service/life-circle.service";
import {PhysicUtil} from "../../common/physic.util";

export class Square extends Shape {
  size: number;
  points: Vector2[];

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

    this.size = size;
    this.points = this.calculatePoints(centerPosition, size);
  }

  private calculatePoints(position: Vector2, size: number): Vector2[] {
    const startPosition: Vector2 = { x: position.x - size / 2, y: position.y - size / 2 }

    return [
      startPosition,
      { x: startPosition.x + size, y: startPosition.y },
      { x: startPosition.x + size, y: startPosition.y + size },
      { x: startPosition.x, y: startPosition.y + size },
    ];
  }

  override move(): void {
    const moveCoefficientX: number = this.velocity.x * LifeCircleService.timeStepPerFrame;
    const moveCoefficientY: number = this.velocity.y * LifeCircleService.timeStepPerFrame;

    this.centerPosition.x += moveCoefficientX;
    this.centerPosition.y += moveCoefficientY;

    this.points.forEach((point: Vector2): void => {
      point.x += moveCoefficientX;
      point.y += moveCoefficientY;
    })
  }

  override rotate(): void {
    this.points = this.points.map((point: Vector2): Vector2 => {
      const x: number = point.x - this.centerPosition.x;
      const y: number = point.y - this.centerPosition.y;

      const cos: number = Math.cos(this.rotationSpeed);
      const sin: number = Math.sin(this.rotationSpeed);

      return {
        x: x * cos - y * sin + this.centerPosition.x,
        y: x * sin + y * cos + this.centerPosition.y,
      };
    });
  }
}
