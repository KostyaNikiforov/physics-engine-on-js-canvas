import { Injectable} from "@angular/core";
import {Vector2} from "../../common/util/model/vector2";
import {
  getCenterOfVectors, getHeightOfStump,
  getVectorMagnitude,
  normalizeVector, subtractVectors,
} from "../../common/util/vector.util";
import {Shape, Square} from "../../model/entity";
import {MathUtil} from "../../common/util/math.util";
import {FULL_CIRCLE} from "../rendar/drawing.service";
import {Overlap} from "../../model/entity/property";

@Injectable({ providedIn: 'root' })
export class CollisionResolvingService {
  apply(shapes: Shape[]): void {

  }

  private resolveBorderSquareCollision(square: Square): void {
    const overlap: Overlap = square.overlaps[0];

    const collisionPoint: Vector2 = getCenterOfVectors(overlap.points);
    const newDirection: Vector2 = normalizeVector(
      subtractVectors(collisionPoint, square.position)
    );

    const velocityMagnitude: number = getVectorMagnitude(square.velocity);
    const depth: number = getHeightOfStump(overlap.points, newDirection);

    this.rotateIfNeeded(square);

    square.velocity = {
      x: newDirection.x * velocityMagnitude,
      y: newDirection.y * velocityMagnitude,
    };

    square.moveOn({
      x: newDirection.x * depth,
      y: newDirection.y * depth,
    });

    square.removeOverlap(overlap.id);
  }

  rotateIfNeeded(square: Square): void {
    if (square.points.length === 0) {
      return;
    }

    const overlap: Overlap = square.overlaps[0];

    const collisionPoint: Vector2 = getCenterOfVectors(overlap.points);
    const normalizedVectorToCollisionPoint: Vector2 = normalizeVector(subtractVectors(square.position, collisionPoint));

    //console.log(dot(normalizedVectorToCollisionPoint, square.direction()));

    const rotationSpeedInMeters: number = MathUtil.findCathetusLength(square.velocity, normalizedVectorToCollisionPoint);

    const rotationSpeedInDegrees: number = FULL_CIRCLE * (rotationSpeedInMeters / MathUtil.getCircleSquare(getVectorMagnitude(normalizedVectorToCollisionPoint)));

    square.setRotationSpeed(collisionPoint.x > square.position.x ? -rotationSpeedInDegrees : rotationSpeedInDegrees);
    square.setRotationPoint(collisionPoint);
  }
}
