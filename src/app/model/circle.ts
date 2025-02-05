import {Shape, ShapeType} from "./shape";
import {Vector2} from "../common/util/model/vector2";
import {Position} from "../common/util/model/position";
import {MathUtil} from "../common/math.util";
import {MATERIALS, MaterialType} from "./material";
import {LifeCircleService} from "../service/world/life-circle.service";
import {FULL_CIRCLE} from "../service/rendar/drawing.service";

const colors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF"
];

export class Circle extends Shape {
  radius: number;
  square: number;
  circuit: number;
  color: string;

  constructor(
    position: Position,
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
      MathUtil.getCircleSquare(radius) * MATERIALS[materialType].density
    );

    this.radius = radius;
    this.square = MathUtil.getCircleSquare(radius);
    this.circuit = MathUtil.getCircleCircuit(radius);
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  setRotationSpeed(speed: number): void {
    this.rotationSpeedAngle
      = FULL_CIRCLE * (speed / this.circuit)  * LifeCircleService.timeStepPerFrame
  }

  rotate(): void {
    this.rotation += this.rotationSpeedAngle;
  }
}
