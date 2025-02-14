import { Shape} from "./shape";
import {Vector2} from "../../common/util/model/vector2";
import {MathUtil} from "../../common/util/math.util";
import {MaterialType} from "../material";
import {COLORS} from "../../common/colors";
import {PhysicUtil} from "../../common/util/physic.util";
import { ShapeType} from "./property";

export class Circle extends Shape {
  private _rotationState: number;
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

    this._rotationState = 0;
    this.radius = radius;
    this.square = MathUtil.getCircleSquare(radius);
    this.circuit = MathUtil.getCircleCircuit(radius);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  override moveOn(vector: Vector2) {
    this.position.x += vector.x;
    this.position.y += vector.y;
  }

  override rotateOn(degree: number): void {
    this.rotationState += degree;
  }

  get rotationState(): number {
    return this._rotationState;
  }

  set rotationState(number: number) {
    this._rotationState = number;
  }
}
