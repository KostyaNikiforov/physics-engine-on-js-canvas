import {Shape, ShapeType} from "./shape";
import {Vector2} from "../common/util/model/vector2";
import {Position} from "../common/util/model/position";
import {MathUtil} from "../common/math.util";
import {MATERIALS, MaterialType} from "./material";
import {LifeCircleService} from "../service/world/life-circle.service";
import {FULL_CIRCLE} from "../service/rendar/drawing.service";

export class Polygon extends Shape {
  points: Vector2[];

  constructor(
    position: Position,
    polygons: Vector2[],
    speed: number,
    direction: Vector2,
    materialType: MaterialType = MaterialType.METAL
  ) {
    super(
      position,
      ShapeType.polygon,
      speed,
      direction,
      5,
    );

    this.points = polygons;
  }
}
