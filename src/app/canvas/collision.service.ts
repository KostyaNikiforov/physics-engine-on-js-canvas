import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Circle} from "../model/circle";
import {WORLD_PROPERTY} from "./canvas.component";
import {Position} from "../common/util/model/position";
import {Vector} from "../common/util/model/vector";
import {getVectorMagnitude, normalizeVector, toVector} from "../common/util/vector.util";

@Injectable({
  providedIn: 'root'
})
export class CollisionService {
  private lowestVelocity: number = 0.4;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  handleCollisionWithCircles(): void {
    const circles: Circle[] = this.objectStorageService.getAll() as Circle[];

    for (let i: number = 0; i < circles.length; i++) {
      for (let j: number = i + 1; j < circles.length; j++) {
        const circle: Circle = circles[i];
        const otherCircle: Circle = circles[j];

        const distance: number = Math.hypot(
          circle.position.x - otherCircle.position.x,
          circle.position.y - otherCircle.position.y,
        );

        if (distance < circle.radius + otherCircle.radius) {
          const positionBetweenTwoCircles: Position = this.getPositionBetweenTwoCircles(
            circle,
            otherCircle,
          );

          const vector1: Vector = normalizeVector(toVector(
            positionBetweenTwoCircles,
            circle.position,
          ));
          const vector2: Vector = normalizeVector(toVector(
            positionBetweenTwoCircles,
            otherCircle.position,
          ));

          const circle1Speed: number = getVectorMagnitude(circle.velocity);
          const circle2Speed: number = getVectorMagnitude(otherCircle.velocity);

          const circle1Energy: number = (circle1Speed * Math.pow(circle.mass, 2)) / 2;
          const circle2Energy: number = (circle2Speed * Math.pow(circle.mass, 2)) / 2;

          const sumOfEnergy: number = circle1Energy + circle2Energy;

          const circle1SpeedAfterCollision: number
            = Math.sqrt((2 * sumOfEnergy) / Math.pow(Math.max(circle.mass, 1.5), 2));
          const circle2SpeedAfterCollision: number
            = Math.sqrt((2 * sumOfEnergy) / Math.pow(Math.max(otherCircle.mass, 1.5), 2));

          circle.velocity.x = vector1.x * circle1SpeedAfterCollision;
          circle.velocity.y = vector1.y * circle1SpeedAfterCollision;

          otherCircle.velocity.x = vector2.x * circle2SpeedAfterCollision;
          otherCircle.velocity.y = vector2.y * circle2SpeedAfterCollision;
        }
      }
    }
  }

  handleCollisionWithBorders(): void {
    this.objectStorageService.getAll().forEach(
      (circle: Circle): void => {
        if (circle.position.x < circle.radius) {
          circle.position.x = circle.radius;
          circle.velocity.x = this.getNewValue(circle.velocity.x);
        }

        if (circle.position.x > WORLD_PROPERTY.width - circle.radius) {
          circle.position.x = WORLD_PROPERTY.width - circle.radius;
          circle.velocity.x = this.getNewValue(circle.velocity.x);
        }

        if (circle.position.y < circle.radius) {
          circle.position.y = circle.radius;
          circle.velocity.y = this.getNewValue(circle.velocity.y);
        }

        if (circle.position.y > WORLD_PROPERTY.height - circle.radius) {
          circle.position.y = WORLD_PROPERTY.height - circle.radius;
          circle.velocity.y = this.getNewValue(circle.velocity.y);
        }
      }
    );
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
}
