import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Shape} from "../model/shape";
import {Circle} from "../model/circle";
import {CANVAS_PROPERTY, FPS, SCALE} from "./canvas.component";
import {Position} from "../common/util/model/position";

const G = 6.674 * Math.pow(10, -11);
const LAND_MASS = 5.972 * Math.pow(10, 24);

@Injectable({
  providedIn: 'root'
})
export class GravityService {
  private readonly landLevel: number = CANVAS_PROPERTY.height;

  private readonly timeStep: number = 1 / FPS;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  handleGravity(): void {
    this.objectStorageService.getAll().forEach(
      (circle: Circle): void => {
        const distanceToSurface = Math.abs(circle.position.y - this.landLevel);

        console.log(distanceToSurface - circle.radius);
        if (distanceToSurface - circle.radius === 0) {
          return;
        }

        const distanceX = 0;
        const distanceY = distanceToSurface + 6_378_000;

        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        const force = this.calculateGravityForce(circle.mass, distance);

        const angle = Math.atan2(distanceY, distanceX);

        // Рассчитываем силу гравитации по осям X и Y
        const forceX = force * Math.cos(angle);
        const forceY = force * Math.sin(angle);

        // Рассчитываем ускорение по осям X и Y
        const accelerationX = forceX / circle.mass * SCALE;
        const accelerationY = forceY / circle.mass * SCALE;

        // Обновляем скорость объекта
        circle.velocity.x += accelerationX * this.timeStep;
        circle.velocity.y += accelerationY * this.timeStep;
      }
    );
  }

  private calculateGravityForce(mass: number, distance: number): number {
    return G * (mass * LAND_MASS) / Math.pow(distance, 2);
  }
}
