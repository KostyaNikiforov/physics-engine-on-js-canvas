import {Vector2} from "./util/model/vector2";

export class MathUtil {
  static getCircleSquare(radius: number): number {
    return Math.PI * radius ** 2;
  }

  static getCircleCircuit(radius: number): number {
    return 2 * Math.PI * radius;
  }

  static getVectorFromAngle(angle: number): Vector2 {
    return { x: Math.cos(this.degreesToRadians(angle)), y: Math.sin(this.degreesToRadians(angle)) };
  }

  static degreesToRadians(degrees: number): number {
    return Math.PI / 180 * degrees;
  }
}
