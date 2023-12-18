import {Position} from "./model/position";
import {Vector} from "./model/vector";

export function toVector(positionStart: Position, positionFinish): Vector {
  return {
    x: positionFinish.x - positionStart.x,
    y: positionFinish.y - positionStart.y,
  };
}

export function normalizeVector(vector: Vector): Vector {
  const length: number = Math.hypot(vector.x, vector.y);

  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

export function getVectorMagnitude(vector: Vector): number {
  return Math.hypot(vector.x, vector.y);
}
