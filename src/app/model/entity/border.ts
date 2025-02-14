import {Shape} from "./shape";
import {Vector2} from "../../common/util/model/vector2";
import {ShapeType} from "./property";

export class Border extends Shape {
  constructor() {
    super(
      { x: 0, y: 0 },
      ShapeType.border,
      0,
      {
        x: 0,
        y: 0,
      },
      Number.MAX_SAFE_INTEGER,
    );
  }

  override moveOn(vector: Vector2): void {
  }

  override rotateOn(degree: number): void {
  }
}
