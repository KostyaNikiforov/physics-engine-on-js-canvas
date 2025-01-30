export class MathUtil {
  static getCircleSquare(radius: number): number {
    return Math.PI * radius ** 2;
  }

  static getCircleCircuit(radius: number): number {
    return 2 * Math.PI * radius;
  }
}
