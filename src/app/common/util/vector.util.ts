import {Position} from "./model/position";
import {Vector2} from "./model/vector2";

export function toVector(positionStart: Position, positionFinish): Vector2 {
  return {
    x: positionFinish.x - positionStart.x,
    y: positionFinish.y - positionStart.y,
  };
}

export function normalizeVector(vector: Vector2): Vector2 {
  const length: number = Math.hypot(vector.x, vector.y);

  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

export function getVectorMagnitude(vector: Vector2): number {
  return Math.hypot(vector.x, vector.y);
}
