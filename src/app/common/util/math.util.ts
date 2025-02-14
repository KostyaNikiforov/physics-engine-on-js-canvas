import {Vector2} from "./model/vector2";

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

  static radiansToDegrees(radians: number): number {
    return 180 / Math.PI * radians;
  }

  static getDistanceBetweenPoints(point1, point2) {
    return Math.hypot(point1.x - point2.x, point1.y - point2.y);
  }

  static getCathetusLength(hypotenuse: number, cathetus: number): number {
    return Math.sqrt(hypotenuse ** 2 - cathetus ** 2);
  }

  static getAngleBetweenVectors(vector1: Vector2, vector2: Vector2): number {
    return Math.acos((vector1.x * vector2.x + vector1.y * vector2.y) / (Math.hypot(vector1.x, vector1.y) * Math.hypot(vector2.x, vector2.y)));
  }

  static getHypotenuseLength(cathetus1: number, cathetus2: number): number {
    return Math.hypot(cathetus1, cathetus2);
  }

  static findCathetusLength(hypotenuseVector: Vector2, normalizedVector: Vector2): number {
    return Math.abs(hypotenuseVector.x * normalizedVector.y - hypotenuseVector.y * normalizedVector.x);
  }
}
