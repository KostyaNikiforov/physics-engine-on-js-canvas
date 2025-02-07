import {Injectable} from "@angular/core";
import {Circle} from "../../model/entities/circle";
import { WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import { LifeCircleService} from "../life-circle.service";
import {PhysicUtil} from "../../common/physic.util";
import {Shape, ShapeType} from "../../model/entities/shape";
import {Square} from "../../model/entities/square";
import {MathUtil} from "../../common/math.util";

const HALF_PI = Math.PI / 2;
const COSINUS_OF_HALF_PI = Math.cos(HALF_PI);
const SINUS_OF_HALF_PI = Math.sin(HALF_PI);

@Injectable({ providedIn: 'root' })
export class GravityService {
  private readonly landLevel: number = WORLD_PROPERTY.height;

  applyLangGravity(shapes: Shape[]): void {
    shapes.forEach(
      (shape: Shape): void => {
        const distanceToSurface: number = this.getDistanceToSurface(shape);

        if (distanceToSurface === 0) {
          return;
        }

        const distance: number = distanceToSurface + 6_378_000;
        const force: number = PhysicUtil.calculateGravityForceToLand(shape.mass, distance);

        const accelerationX: number = (force * COSINUS_OF_HALF_PI) / shape.mass;
        const accelerationY: number = (force * SINUS_OF_HALF_PI) / shape.mass;

        shape.velocity.x += accelerationX * LifeCircleService.timeStepPerFrame;
        shape.velocity.y += accelerationY * LifeCircleService.timeStepPerFrame;
      }
    );
  }

  apply(shapes: Shape[]): void {
    for (let i: number = 0; i < shapes.length; i++) {
      for (let j: number = i + 1; j < shapes.length; j++) {
        if (shapes[i].type !== ShapeType.circle || shapes[j].type !== ShapeType.circle) {
          continue;
        }

        const circle1: Circle = shapes[i] as Circle;
        const circle2: Circle = shapes[j]  as Circle;

        const distanceX: number = circle1.centerPosition.x - circle2.centerPosition.x;
        const distanceY: number = circle1.centerPosition.y - circle2.centerPosition.y;

        const distance: number =  MathUtil.getDistanceBetweenPoints(circle1.centerPosition, circle2.centerPosition)

        if (distance <= circle1.radius + circle2.radius) {
          continue;
        }

        const force: number = PhysicUtil.calculateGravityForce(
          this.increasedMass(circle1.mass),
          this.increasedMass(circle2.mass),
          distance
        );

        const angle: number = Math.atan2(distanceY, distanceX);

        const forceX: number = force * Math.cos(angle);
        const forceY: number = force * Math.sin(angle);

        const circle1AccelerationX: number = forceX / circle1.mass;
        const circle1AccelerationY: number = forceY / circle1.mass;

        const circle2AccelerationX: number = forceX / circle2.mass;
        const circle2AccelerationY: number = forceY / circle2.mass;

        circle1.velocity.x += -circle1AccelerationX * LifeCircleService.timeStepPerFrame;
        circle1.velocity.y += -circle1AccelerationY * LifeCircleService.timeStepPerFrame;

        circle2.velocity.x += circle2AccelerationX * LifeCircleService.timeStepPerFrame;
        circle2.velocity.y += circle2AccelerationY * LifeCircleService.timeStepPerFrame;
      }
    }
  }

  private getDistanceToSurface(shape: Shape): number {
    switch (shape.type) {
      case ShapeType.circle:
        return this.getDistanceToSurfaceForCircle(shape as Circle);
      case ShapeType.square:
        return this.getDistanceToSurfaceForSquare(shape as Square);
      default:
        return 0;
    }
  }

  private increasedMass(value: number): number {
    return value * 200_000;
  }

  private getDistanceToSurfaceForCircle(circle: Circle): number {
    return this.landLevel - circle.centerPosition.y - circle.radius;
  }

  private getDistanceToSurfaceForSquare(square: Square): number {
    return this.landLevel - square.centerPosition.y - square.size / 2;
  }
}
