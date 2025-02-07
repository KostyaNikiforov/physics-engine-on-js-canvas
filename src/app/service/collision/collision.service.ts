import {inject, Injectable} from "@angular/core";
import {Circle} from "../../model/entities/circle";
import { WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {Vector2} from "../../common/util/model/vector2";
import {getVectorMagnitude, normalizeVector, toVector} from "../../common/util/vector.util";
import {Shape, ShapeType} from "../../model/entities/shape";
import {Square} from "../../model/entities/square";
import {ObjectRenderingService} from "../rendar/object-rendering.service";
import {ToolBarService} from "../../canvas-page/tool-bar/tool-bar.service";
import {MathUtil} from "../../common/math.util";

@Injectable({ providedIn: 'root' })
export class CollisionService {
  private readonly objectRenderingService: ObjectRenderingService = inject(ObjectRenderingService);
  private readonly toolBarService: ToolBarService = inject(ToolBarService);

  private lowestVelocity: number = 0.6;

  apply(shapes: Shape[]): void {
    if (this.toolBarService.collisionEnabled) {
      this.handleCircles(shapes.filter((shape: Shape): boolean => shape.type === ShapeType.circle) as Circle[]);
    }

    if (this.toolBarService.borderCollisionEnabled) {
      this.handleWithBorders(shapes);
    }
  }

  handleWithBorders(shapes: Shape[]): void {
    shapes.forEach(
      (shape: Shape): void => {
        switch (shape.type) {
          case ShapeType.circle:
            this.handleBorderCircleCollision(shape as Circle);
            break;
          case ShapeType.square:
            this.handleBorderSquareCollision(shape as Square);
            break;
        }
      }
    );
  }

  private handleBorderCircleCollision(circle: Circle): void {
    if (circle.centerPosition.x <= circle.radius) {
      circle.centerPosition.x = circle.radius;
      circle.velocity.x = this.getNewValue(circle.velocity.x);

      // circle.setRotationSpeed(circle.velocity.y);
    }

    if (circle.centerPosition.x >= WORLD_PROPERTY.width - circle.radius) {
      circle.centerPosition.x = WORLD_PROPERTY.width - circle.radius;
      circle.velocity.x = this.getNewValue(circle.velocity.x);

      // circle.setRotationSpeed(circle.velocity.y);
    }

    if (circle.centerPosition.y <= circle.radius) {
      circle.centerPosition.y = circle.radius;
      circle.velocity.y = this.getNewValue(circle.velocity.y);

      // circle.setRotationSpeed(circle.velocity.x);
    }

    if (circle.centerPosition.y >= WORLD_PROPERTY.height - circle.radius) {
      circle.centerPosition.y = WORLD_PROPERTY.height - circle.radius;
      circle.velocity.y = this.getNewValue(circle.velocity.y);

      // circle.setRotationSpeed(circle.velocity.x);

      // TODO: EXPERIMENTAL
      if (Math.abs(circle.velocity.y) < 0.5) {
        circle.velocity.y = 0;
      }
    }
  }

  private handleBorderSquareCollision(square: Square): void {
    const points = getIntersectionPoints(square.points, [{x: 0, y: WORLD_PROPERTY.height}, {
      x: WORLD_PROPERTY.width,
      y: WORLD_PROPERTY.height
    }]);

    if (points.length === 0) {
      return;
    }

    console.log(points);

    this.objectRenderingService.draw((drawingService, toX, toY) => {
      drawingService.drawSquare(points
        .map((point) => ({x: toX(point.x), y: toY(point.y)})), '#f00');
    });
  }

  handleCircles(circles: Circle[]): void {
    for (let i: number = 0; i < circles.length; i++) {
      for (let j: number = i + 1; j < circles.length; j++) {
        const circle1: Circle = circles[i];
        const circle2: Circle = circles[j];

        const collisionDistance: number = this.circlesCollisionDistance(circle1, circle2);

        if (collisionDistance < 0) {
          const positionBetweenTwoCircles: Vector2 = this.getPositionBetweenTwoCircles(
            circle1,
            circle2,
          );

          const vector1: Vector2 = normalizeVector(toVector(
            positionBetweenTwoCircles,
            circle1.centerPosition,
          ));
          const vector2: Vector2 = normalizeVector(toVector(
            positionBetweenTwoCircles,
            circle2.centerPosition,
          ));

          const circle1Speed: number = getVectorMagnitude(circle1.velocity);
          const circle2Speed: number = getVectorMagnitude(circle2.velocity);

          const newCircle1Speed: number
            = (2 * circle2.mass * circle2Speed + circle1Speed * (circle1.mass - circle2.mass))
            / (circle1.mass + circle2.mass);

          const newCircle2Speed: number
            = (2 * circle1.mass * circle1Speed + circle2Speed * (circle2.mass - circle1.mass))
            / (circle1.mass + circle2.mass);

          // Update velocities
          circle1.velocity.x = vector1.x * newCircle1Speed;
          circle1.velocity.y = vector1.y * newCircle1Speed;

          circle2.velocity.x = vector2.x * newCircle2Speed;
          circle2.velocity.y = vector2.y * newCircle2Speed;

          // Update positions
          const absCollisionDistance: number = Math.abs(collisionDistance) / 2;

          circle1.centerPosition.x += vector1.x * absCollisionDistance;
          circle1.centerPosition.y += vector1.y * absCollisionDistance;

          circle2.centerPosition.x += vector2.x * absCollisionDistance;
          circle2.centerPosition.y += vector2.y * absCollisionDistance;
        }
      }
    }
  }

  private getPositionBetweenTwoCircles(
    circle: Circle,
    otherCircle: Circle,
  ): Vector2 {
    return {
      x: (circle.centerPosition.x + otherCircle.centerPosition.x) / 2,
      y: (circle.centerPosition.y + otherCircle.centerPosition.y) / 2,
    };
  }

  private getNewValue(value: number): number {
    return -(value * this.lowestVelocity);
  }

  private circlesCollisionDistance(circle1: Circle, circle2: Circle): number {
    const distance: number = MathUtil.getDistanceBetweenPoints(circle1.centerPosition, circle2.centerPosition);

    return distance - (circle1.radius + circle2.radius);
  }
}

function doPolygonsIntersect(a: Vector2[], b: Vector2[]): boolean {
  let polygons: Vector2[][] = [a, b];

  for (let i = 0; i < polygons.length; i++) {
    let polygon = polygons[i];

    for (let i1 = 0; i1 < polygon.length; i1++) {
      let i2 = (i1 + 1) % polygon.length;
      let p1 = polygon[i1];
      let p2 = polygon[i2];

      // Find perpendicular vector (normal)
      let normal = { x: p2.y - p1.y, y: p1.x - p2.x };

      let minA = Infinity, maxA = -Infinity;
      let minB = Infinity, maxB = -Infinity;

      // Project polygon 'a' onto the normal
      for (let j = 0; j < a.length; j++) {
        let projected = normal.x * a[j].x + normal.y * a[j].y;
        minA = Math.min(minA, projected);
        maxA = Math.max(maxA, projected);
      }

      // Project polygon 'b' onto the normal
      for (let j = 0; j < b.length; j++) {
        let projected = normal.x * b[j].x + normal.y * b[j].y;
        minB = Math.min(minB, projected);
        maxB = Math.max(maxB, projected);
      }

      // If there's a gap, the polygons do not intersect
      if (maxA < minB || maxB < minA) {
        return false;
      }
    }
  }

  return true;
}

function getIntersectionPoints(a: Vector2[], b: Vector2[]): Vector2[] {
  let intersectionPoints: Vector2[] = [];

  // Функция для проверки пересечения двух отрезков
  function lineIntersection(p1: Vector2, p2: Vector2, q1: Vector2, q2: Vector2): Vector2 | null {
    let A1 = p2.y - p1.y;
    let B1 = p1.x - p2.x;
    let C1 = A1 * p1.x + B1 * p1.y;

    let A2 = q2.y - q1.y;
    let B2 = q1.x - q2.x;
    let C2 = A2 * q1.x + B2 * q1.y;

    let det = A1 * B2 - A2 * B1;

    if (det === 0) return null; // Отрезки параллельны

    let x = (B2 * C1 - B1 * C2) / det;
    let y = (A1 * C2 - A2 * C1) / det;

    if (
      Math.min(p1.x, p2.x) <= x && x <= Math.max(p1.x, p2.x) &&
      Math.min(p1.y, p2.y) <= y && y <= Math.max(p1.y, p2.y) &&
      Math.min(q1.x, q2.x) <= x && x <= Math.max(q1.x, q2.x) &&
      Math.min(q1.y, q2.y) <= y && y <= Math.max(q1.y, q2.y)
    ) {
      return { x, y };
    }

    return null;
  }

  // Проверяем пересечение рёбер обоих многоугольников
  for (let i = 0; i < a.length; i++) {
    let a1 = a[i];
    let a2 = a[(i + 1) % a.length];

    for (let j = 0; j < b.length; j++) {
      let b1 = b[j];
      let b2 = b[(j + 1) % b.length];

      let intersection = lineIntersection(a1, a2, b1, b2);
      if (intersection) {
        intersectionPoints.push(intersection);
      }
    }
  }

  // Функция проверки, находится ли точка внутри многоугольника
  function isInside(point: Vector2, polygon: Vector2[]): boolean {
    let count = 0;
    let x = point.x, y = point.y;

    for (let i = 0; i < polygon.length; i++) {
      let v1 = polygon[i];
      let v2 = polygon[(i + 1) % polygon.length];

      if ((v1.y > y) !== (v2.y > y)) {
        let intersectX = (v2.x - v1.x) * (y - v1.y) / (v2.y - v1.y) + v1.x;
        if (x < intersectX) count++;
      }
    }

    return count % 2 === 1;
  }

  // Добавляем внутренние точки одного многоугольника, находящиеся внутри другого
  for (let i = 0; i < a.length; i++) {
    if (isInside(a[i], b)) {
      intersectionPoints.push(a[i]);
    }
  }

  for (let i = 0; i < b.length; i++) {
    if (isInside(b[i], a)) {
      intersectionPoints.push(b[i]);
    }
  }

  return intersectionPoints;
}

function isUndefined(value: any): boolean {
  return typeof value === 'undefined';
}

// Function to calculate dot product of vectors
function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

// Function to calculate perpendicular vector
function perpendicularVector(v) {
  return { x: -v.y, y: v.x };
}

// Function to project polygon points onto an axis and return min/max values
function projectPolygon(axis, polygons) {
  let min = dotProduct(axis, polygons[0]);
  let max = min;

  for (let i = 1; i < polygons.length; i++) {
    const projection = dotProduct(axis, polygons[i]);
    if (projection < min) {
      min = projection;
    } else if (projection > max) {
      max = projection;
    }
  }

  return { min, max };
}
