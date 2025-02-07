import {Vector2} from "./model/vector2";

export function toVector(positionStart: Vector2, positionFinish): Vector2 {
  return {
    x: positionFinish.x - positionStart.x,
    y: positionFinish.y - positionStart.y,
  };
}

export function normalizeVector(vector: Vector2): Vector2 {
  if (vector.x === 0 && vector.y === 0) {
    return { x: 0, y: 0 };
  }

  const length: number = Math.hypot(vector.x, vector.y);

  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

export function getVectorMagnitude(vector: Vector2): number {
  return Math.hypot(vector.x, vector.y);
}
