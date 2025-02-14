import {Vector2} from "./model/vector2";

export class ShapeUtil {
  static calculateSquarePoints(position: Vector2, size: number): Vector2[] {
    const halfSize: number = size / 2;
    const startPosition: Vector2 = { x: position.x - halfSize, y: position.y - halfSize }

    return [
      startPosition,
      { x: startPosition.x + size, y: startPosition.y },
      { x: startPosition.x + size, y: startPosition.y + size },
      { x: startPosition.x, y: startPosition.y + size },
    ];
  }
}
