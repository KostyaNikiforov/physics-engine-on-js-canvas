import {Shape} from "./shape";
import {ShapeType} from "./property";
import {zero} from "../../common/util/vector.util";

export class Border extends Shape {
  constructor(mass: number) {
    super(
      zero(),
      ShapeType.border,
      0,
      zero(),
      mass,
    );
  }

  override moveOn(): void { }

  override rotateOn(): void { }
}
