import {Injectable} from "@angular/core";
import {ObjectStorageService} from "../world/object-storage.service";
import {Circle} from "../../model/circle";
import { WORLD_PROPERTY} from "../../canvas-page/canvas.component";
import {Position} from "../../common/util/model/position";
import {Vector2} from "../../common/util/model/vector2";
import {getVectorMagnitude, normalizeVector, toVector} from "../../common/util/vector.util";
import {Shape, ShapeType} from "../../model/shape";
import {getDistanceBetweenPoints} from "../../common/position.util";
import {Polygon} from "../../model/polygon";

@Injectable({
  providedIn: 'root'
})
export class CollisionService {
  private lowestVelocity: number = 0.7;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  handleWithBorders(): void {
    this.objectStorageService.getAll().forEach(
      (shape: Shape): void => {
        if (shape.type !== ShapeType.circle) {
          return;
        }

        const circle: Circle = shape as Circle;

        if (circle.position.x <= circle.radius) {
          circle.position.x = circle.radius;
          circle.velocity.x = this.getNewValue(circle.velocity.x);

          circle.setRotationSpeed(circle.velocity.y);
        }

        if (circle.position.x >= WORLD_PROPERTY.width - circle.radius) {
          circle.position.x = WORLD_PROPERTY.width - circle.radius;
          circle.velocity.x = this.getNewValue(circle.velocity.x);

          circle.setRotationSpeed(circle.velocity.y);
        }

        if (circle.position.y <= circle.radius) {
          circle.position.y = circle.radius;
          circle.velocity.y = this.getNewValue(circle.velocity.y);

          circle.setRotationSpeed(circle.velocity.x);
        }

        if (circle.position.y >= WORLD_PROPERTY.height - circle.radius) {
          circle.position.y = WORLD_PROPERTY.height - circle.radius;
          circle.velocity.y = this.getNewValue(circle.velocity.y);

          circle.setRotationSpeed(circle.velocity.x);
        }
      }
    );
  }

  handleWithCircles(): void {
    const circles: Circle[] = this.objectStorageService.getAll() as Circle[];

    for (let i: number = 0; i < circles.length; i++) {
      for (let j: number = i + 1; j < circles.length; j++) {
        const circle1: Circle = circles[i];
        const circle2: Circle = circles[j];

        const collisionDistance: number = this.circlesCollisionDistance(circle1, circle2);

        if (collisionDistance < 0) {
          const positionBetweenTwoCircles: Position = this.getPositionBetweenTwoCircles(
            circle1,
            circle2,
          );

          const vector1: Vector2 = normalizeVector(toVector(
            positionBetweenTwoCircles,
            circle1.position,
          ));
          const vector2: Vector2 = normalizeVector(toVector(
            positionBetweenTwoCircles,
            circle2.position,
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

          circle1.position.x += vector1.x * absCollisionDistance;
          circle1.position.y += vector1.y * absCollisionDistance;

          circle2.position.x += vector2.x * absCollisionDistance;
          circle2.position.y += vector2.y * absCollisionDistance;
        }
      }
    }
  }

  handle(): void {
    const shapes: Shape[] = this.objectStorageService.getAll();

    for (let i: number = 0; i < shapes.length; i++) {
      for (let j: number = i + 1; j < shapes.length; j++) {
        const shape1: Shape = shapes[i];
        const shape2: Shape = shapes[j];

        const hasCollision = this.circleComplexCollision(shape1, shape2);

        console.log(hasCollision)

        if (hasCollision) {
          shape1.velocity.x = 0;
          shape1.velocity.y = 0;

          shape2.velocity.x = 0;
          shape2.velocity.y = 0;
        }
      }
    }
  }

  private circleComplexCollision(
    shape1: Shape,
    shape2: Shape,
  ): boolean {
    /*if (shape1.type === ShapeType.circle && shape2.type === ShapeType.circle) {
      return this.circlesCollisionDistance(shape1 as Circle, shape2 as Circle) < 0;
    }*/

    if (shape1.type === ShapeType.circle && shape2.type === ShapeType.polygon) {
      return this.hasCollisionCircleWithPolygon(shape1 as Circle, shape2 as Polygon);
    }

    if (shape1.type === ShapeType.polygon && shape2.type === ShapeType.circle) {
      return this.hasCollisionCircleWithPolygon(shape2 as Circle, shape1 as Polygon);
    }

    return false;
  }

  private hasCollisionCircleWithPolygon(
    circle: Circle,
    polygon: Polygon,
  ): boolean {
    // Calculate the center of the circle
    const circleCenter = { x: circle.position.x, y: circle.position.y };

    // Calculate the vector from circle center to polygon vertices
    const circleToPolygon = polygon.points.map(vertex => ({ x: vertex.x - circleCenter.x, y: vertex.y - circleCenter.y }));

    // For each edge of the polygon, calculate its normal (axis)
    for (let i = 0; i < polygon.points.length; i++) {
      const edgeStart = circleToPolygon[i];
      const edgeEnd = circleToPolygon[(i + 1) % polygon.points.length];

      // Calculate edge vector
      const edgeVector = { x: edgeEnd.x - edgeStart.x, y: edgeEnd.y - edgeStart.y };

      // Calculate axis (normal) for separation
      const axis = perpendicularVector(edgeVector);

      // Project both circle and polygon onto the axis
      const circleProjection = dotProduct(axis, circleCenter);
      const polygonProjection = projectPolygon(axis, polygon.points);

      // Check for gap between projections (SAT test)
      if (!((circleProjection + circle.radius > polygonProjection.min && circleProjection + circle.radius < polygonProjection.max) ||
        (circleProjection - circle.radius > polygonProjection.min && circleProjection - circle.radius < polygonProjection.max))) {
        return false;
      }
    }

    return true;
  }

  private getPositionBetweenTwoCircles(
    circle: Circle,
    otherCircle: Circle,
  ): Position {
    return {
      x: (circle.position.x + otherCircle.position.x) / 2,
      y: (circle.position.y + otherCircle.position.y) / 2,
    };
  }

  private getNewValue(value: number): number {
    return -(value * this.lowestVelocity);
  }

  private circlesCollisionDistance(circle1: Circle, circle2: Circle): number {
    const distance: number = getDistanceBetweenPoints(circle1.position, circle2.position);

    return distance - (circle1.radius + circle2.radius);
  }
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
