import {Vector2} from "./model/vector2";

export function getCenterOfVectors(points: Vector2[]): Vector2 {
  return {
    x: points.reduce((acc, point) => acc + point.x, 0) / points.length,
    y: points.reduce((acc, point) => acc + point.y, 0) / points.length,
  };
}

export function zero(): Vector2 {
  return { x: 0, y: 0 };
}

export function copyVector(vector: Vector2): Vector2 {
  return { x: vector.x, y: vector.y };
}

export function multiplyVector(vector: Vector2, scalar: number): Vector2 {
  return { x: vector.x * scalar, y: vector.y * scalar };
}

export function getHeightOfStump(points: Vector2[], direction: Vector2): number {
  const center: Vector2 = getCenterOfVectors(points);

  return Math.abs(points.reduce((acc, point) => {
    const vector: Vector2 = subtractVectors(center, point);
    const scalar: number = dot(vector, direction);

    return scalar < acc ? scalar : acc;
  }, Infinity));
}

export function isSameDirection(vector1: Vector2, vector2: Vector2): boolean {
  return dot(vector1, vector2) > 0;
}

export function subtractVectors(vector1: Vector2, vector2: Vector2): Vector2 {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
  };
}

export function reflectVector(vector: Vector2, normal: Vector2): Vector2 {
  const scalar: number = 2 * dot(vector, normal);

  return {
    x: vector.x - scalar * normal.x,
    y: vector.y - scalar * normal.y,
  };
}

export function reverseVector(vector: Vector2): Vector2 {
  return {
    x: -vector.x,
    y: -vector.y
  };
}

export function getVectorsDirectionDifference(vector1: Vector2, vector2: Vector2): number {
  return Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
}

export function normalizeVector(vector: Vector2): Vector2 {
  const length: number = getVectorMagnitude(vector);

  return {
    x: vector.x ? vector.x / length : 0,
    y: vector.y ? vector.y / length : 0,
  };
}

export function cross(v1: Vector2, v2: Vector2): Vector2 {
  return {
    x: v1.y * v2.y,
    y: v1.x * v2.x,
  };
}

// Function to calculate scalar product of vectors
export function dot(v1: Vector2, v2: Vector2): number {
  return v1.x * v2.x + v1.y * v2.y;
}

// Function to project polygon points onto an axis and return min/max values
export function projectPolygon(axis: Vector2, polygons: Vector2[]) {
  let min = dot(axis, polygons[0]);
  let max = min;

  for (let i = 1; i < polygons.length; i++) {
    const projection = dot(axis, polygons[i]);
    if (projection < min) {
      min = projection;
    } else if (projection > max) {
      max = projection;
    }
  }

  return { min, max };
}

export function getVectorMagnitude(vector: Vector2): number {
  return Math.hypot(vector.x, vector.y);
}
