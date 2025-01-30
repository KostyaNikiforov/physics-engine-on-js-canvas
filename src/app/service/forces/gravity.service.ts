import {Injectable} from "@angular/core";
import {ObjectStorageService} from "../world/object-storage.service";
import {Circle} from "../../model/circle";
import { WORLD_PROPERTY} from "../../canvas-page/canvas.component";
import {getDistanceBetweenPoints} from "../../common/position.util";
import { LifeCircleService} from "../world/life-circle.service";
import {PhysicUtil} from "../../common/physic.util";
import {Shape, ShapeType} from "../../model/shape";

const HALF_PI = Math.PI / 2;
const COSINUS_OF_HALF_PI = Math.cos(HALF_PI);
const SINUS_OF_HALF_PI = Math.sin(HALF_PI);

@Injectable({
  providedIn: 'root'
})
export class GravityService {
  private readonly landLevel: number = WORLD_PROPERTY.height;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  applyLangGravity(): void {
    this.objectStorageService.getAll().forEach(
      (shape: Shape): void => {
        if (shape.type !== ShapeType.circle) {
          return;
        }

        const circle: Circle = shape as Circle;

        const distanceToSurface: number
          = Math.abs(circle.position.y - this.landLevel);

        const distance: number = distanceToSurface + 6_378_000;
        const force: number = PhysicUtil.calculateGravityForceToLand(circle.mass, distance);

        const accelerationX: number = (force * COSINUS_OF_HALF_PI) / circle.mass;
        const accelerationY: number = (force * SINUS_OF_HALF_PI) / circle.mass;

        circle.velocity.x += accelerationX * LifeCircleService.timeStepPerFrame;
        circle.velocity.y += accelerationY * LifeCircleService.timeStepPerFrame;
      }
    );
  }

  apply(): void {
    const shapes: Shape[] = this.objectStorageService.getAll();

    for (let i: number = 0; i < shapes.length; i++) {
      for (let j: number = i + 1; j < shapes.length; j++) {
        if (shapes[i].type !== ShapeType.circle || shapes[j].type !== ShapeType.circle) {
          continue;
        }

        const circle1: Circle = shapes[i] as Circle;
        const circle2: Circle = shapes[j]  as Circle;

        const distanceX: number = circle1.position.x - circle2.position.x;
        const distanceY: number = circle1.position.y - circle2.position.y;

        const distance: number = getDistanceBetweenPoints(circle1.position, circle2.position)

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

  private increasedMass(value: number): number {
    return value * 200_000;
  }
}
