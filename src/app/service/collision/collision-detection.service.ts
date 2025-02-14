import {inject, Injectable} from "@angular/core";
import { WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {Vector2} from "../../common/util/model/vector2";
import {
  cross,
  dot,
  isSameDirection,
  normalizeVector, reverseVector, subtractVectors,
} from "../../common/util/vector.util";
import {ObjectRenderingService} from "../rendar/object-rendering.service";
import {ToolBarService} from "../../canvas-page/tool-bar/tool-bar.service";
import {MathUtil} from "../../common/util/math.util";
import {LifeCircleService} from "../life-circle.service";
import {Border, Circle, Shape, Square} from "../../model/entity";
import {Overlap, ShapeType} from "../../model/entity/property";

type PointsAndDirection = {
  points?: Vector2[];
  direction?: Vector2;
}

@Injectable({ providedIn: 'root' })
export class CollisionDetectionService {
  private readonly objectRenderingService: ObjectRenderingService = inject(ObjectRenderingService);
  private readonly toolBarService: ToolBarService = inject(ToolBarService);

  private readonly borderShape: Shape = new Border(Number.MAX_SAFE_INTEGER);

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
            //this.detectBorderSquareCollision2(shape as Square);
            break;
        }
      }
    );
  }

  private handleBorderCircleCollision(circle: Circle): void {
    const nextPosition: Vector2 = {
      x: circle.position.x + circle.velocity.x * LifeCircleService.timeStepPerFrame,
      y: circle.position.y + circle.velocity.y * LifeCircleService.timeStepPerFrame,
    };

    const depthBottomBorder: number = nextPosition.y - (WORLD_PROPERTY.height - circle.radius);

    if (depthBottomBorder > 0) {
      circle.addOverlap(Overlap.of({
        points: [
          { x: nextPosition.x, y: WORLD_PROPERTY.height },
        ],
        depth: depthBottomBorder,
        normal: { x: 0, y: -1 },
        shape: this.borderShape,
      }));

      return;
    }

    const depthLeftBorder: number = circle.radius - nextPosition.x;

    if (depthLeftBorder > 0) {
      circle.addOverlap(Overlap.of({
        points: [
          { x: 0, y: nextPosition.y },
        ],
        depth: depthLeftBorder,
        normal: { x: 1, y: 0 },
        shape: this.borderShape,
      }));

      return;
    }

    const depthRightBorder: number = nextPosition.x - (WORLD_PROPERTY.width - circle.radius);

    if (depthRightBorder > 0) {
      circle.addOverlap(Overlap.of({
        points: [
          {x: WORLD_PROPERTY.width, y: nextPosition.y},
        ],
        depth: depthRightBorder,
        normal: { x: -1, y: 0 },
        shape: this.borderShape,
      }));

      return;
    }

    const depthTopBorder: number = circle.radius - nextPosition.y;

    if (depthTopBorder > 0) {
      circle.addOverlap(Overlap.of({
        points: [
          {x: nextPosition.x, y: 0},
        ],
        depth: depthTopBorder,
        normal: { x: 0, y: 1 },
        shape: this.borderShape,
      }));

      return;
    }
  }

  handleCircles(circles: Circle[]): void {
    for (let i: number = 0; i < circles.length; i++) {
      for (let j: number = i + 1; j < circles.length; j++) {
        const circle1: Circle = circles[i];
        const circle2: Circle = circles[j];

        circle1.nextPosition = {
          x: circle1.position.x + circle1.velocity.x * LifeCircleService.timeStepPerFrame,
          y: circle1.position.y + circle1.velocity.y * LifeCircleService.timeStepPerFrame,
        };

        circle2.nextPosition = {
          x: circle2.position.x + circle2.velocity.x * LifeCircleService.timeStepPerFrame,
          y: circle2.position.y + circle2.velocity.y * LifeCircleService.timeStepPerFrame,
        };

        const nextPosition1: Vector2 = circle1.nextPosition;
        const nextPosition2: Vector2 = circle2.nextPosition;

        const collisionDistance: number
          = MathUtil.getDistanceBetweenPoints(nextPosition1, nextPosition2) - (circle1.radius + circle2.radius);

        if (collisionDistance < 0) {
          const positionBetweenTwoCircles: Vector2 = this.getPositionBetweenTwoCircles(
            circle1,
            circle2,
          );

          const vector1: Vector2 = normalizeVector(subtractVectors(
            positionBetweenTwoCircles,
            nextPosition1,
          ));
          const vector2: Vector2 = normalizeVector(subtractVectors(
            positionBetweenTwoCircles,
            nextPosition2,
          ));

          circle1.addOverlap(Overlap.of({
            points: [positionBetweenTwoCircles],
            depth: collisionDistance / 2,
            normal: vector1,
            shape: circle2,
          }));


          circle2.addOverlap(Overlap.of({
            points: [positionBetweenTwoCircles],
            depth: collisionDistance / 2,
            normal: vector2,
            shape: circle1,
          }));
        }
      }
    }
  }

  private getPositionBetweenTwoCircles(
    circle: Circle,
    otherCircle: Circle,
  ): Vector2 {
    return {
      x: (circle.position.x + otherCircle.position.x) / 2,
      y: (circle.position.y + otherCircle.position.y) / 2,
    };
  }

  private detectBorderSquareCollision2(square: Square): void {
    const land: Vector2[] = [
      {x: 0, y: WORLD_PROPERTY.height},
      {x: WORLD_PROPERTY.width, y: WORLD_PROPERTY.height},
    ];


    /*this.objectRenderingService.draw((drawingService, toX, toY) => {
      drawingService.drawPoint({ x: toX(distance.x), y: toY(WORLD_PROPERTY.height + distance.y) }, '#f00');
    });*/
  }

  private GJKAlgorithm(points1: Vector2[], points2: Vector2[]): boolean {
    const support: Vector2 = this.support(points1, points2, {x: 0, y: 1});

    let points: Vector2[] = [support];
    let direction: Vector2 = reverseVector(support);

    while (true) {
      const newSupport: Vector2 = this.support(points1, points2, direction);

      if (dot(newSupport, direction) <= 0) {
        return false;
      }

      points.push(newSupport);

      switch (points.length) {
        case 2:
          const result = this.lineCase(points, direction);

          points = result.points ? result.points : points;
          direction = result.direction ? result.direction : direction;

          break;
        case 3:
          const result1 = this.triangleCase(points, direction);

          points = result1.points ? result1.points : points;
          direction = result1.direction ? result1.direction : direction;

          break;
        case 4:
          const result2 = this.tetrahedronCase(points, direction);

          points = result2.points ? result2.points : points;
          direction = result2.direction ? result2.direction : direction;

          return true;
      }
    }
  }

  private lineCase(points: Vector2[], direction: Vector2): PointsAndDirection {
    const a: Vector2 = points[0];
    const b: Vector2 = points[1];

    const ab: Vector2 = subtractVectors(b, a);
    const ao: Vector2 = reverseVector(a);

    if (isSameDirection(ab, ao)) {
      return {
        direction: cross(cross(ab, ao), ab),
      };
    } else {
      return {
        points: [a],
        direction: ao,
      };
    }
  }

  private triangleCase(points: Vector2[], direction: Vector2): PointsAndDirection {
    const a: Vector2 = points[0];
    const b: Vector2 = points[1];
    const c: Vector2 = points[2];

    const ab: Vector2 = subtractVectors(b, a);
    const ac: Vector2 = subtractVectors(c, a);
    const ao: Vector2 = reverseVector(a);

    const abc: Vector2 = cross(ab, ac);

    if (isSameDirection(cross(abc, ac), ao)) {
      if (isSameDirection(ac, ao)) {
        return {
          points: [a, c],
          direction: cross(cross(ac, ao), ac),
        };
      } else {
        return this.lineCase([a, c], direction);
      }
    } else {
      if (isSameDirection(cross(ab, abc), ao)) {
        return this.lineCase([a, b], direction);
      } else {
        if (isSameDirection(abc, ao)) {
          return {
            direction: abc,
          };
        } else {
          return {
            points: [a, b, c],
            direction: reverseVector(abc),
          };
        }
      }
    }
  }

  private tetrahedronCase(points: Vector2[], direction: Vector2): PointsAndDirection {
    const a: Vector2 = points[0];
    const b: Vector2 = points[1];
    const c: Vector2 = points[2];
    const d: Vector2 = points[3];

    const ab: Vector2 = subtractVectors(b, a);
    const ac: Vector2 = subtractVectors(c, a);
    const ad: Vector2 = subtractVectors(d, a);
    const ao: Vector2 = reverseVector(a);

    const abc: Vector2 = cross(ab, ac);
    const acd: Vector2 = cross(ac, ad);
    const adb: Vector2 = cross(ad, ab);

    if (isSameDirection(abc, ao)) {
      return this.triangleCase([a, b, c], direction);
    }

    if (isSameDirection(acd, ao)) {
      return this.triangleCase([a, c, d], direction);
    }

    if (isSameDirection(adb, ao)) {
      return this.triangleCase([a, d, b], direction);
    }

    return {};
  }

  private support(points: Vector2[], points2: Vector2[], direction: Vector2): Vector2 {
    const furthestPointFromSquare: Vector2 = this.findFurthestPoint(points, direction)
    const furthestPointFromLand: Vector2 = this.findFurthestPoint(points2, reverseVector(direction))

    return subtractVectors(furthestPointFromSquare, furthestPointFromLand);
  }

  private findFurthestPoint(points: Vector2[], direction: Vector2): Vector2 {
    let maxDistance: number = -Infinity;
    let furthestPoint: Vector2 = null;

    for (let i: number = 0; i < points.length; i++) {
      const distance: number = dot(points[i], direction);

      if (distance > maxDistance) {
        maxDistance = distance;
        furthestPoint = points[i];
      }
    }

    return furthestPoint
  }

  private handleBorderSquareCollision(square: Square): void {
    const points: Vector2[] = getIntersectionPoints(square.points, [
      {x: 0, y: WORLD_PROPERTY.height},
      {x: WORLD_PROPERTY.width, y: WORLD_PROPERTY.height},
      {x: WORLD_PROPERTY.width, y: WORLD_PROPERTY.height + 5},
      {x: 0, y: WORLD_PROPERTY.height + 5},
    ]);

    /*square.addOverlap({
      points: points,
      depth: 0,
    });*/

    if (points.length === 0) {
      return;
    }

    this.objectRenderingService.draw((drawingService, toX, toY) => {
      drawingService.drawSquare(points
        .map((point) => ({x: toX(point.x), y: toY(point.y)})), '#f00');
    });
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
