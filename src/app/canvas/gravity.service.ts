import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Circle} from "../model/circle";
import { FPS, WORLD_PROPERTY} from "./canvas.component";

const G = 6.674 * Math.pow(10, -11);
const LAND_MASS = 5.972 * Math.pow(10, 24);

@Injectable({
  providedIn: 'root'
})
export class GravityService {
  private readonly landLevel: number = WORLD_PROPERTY.height;

  private readonly timeStep: number = 1 / FPS;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  handleGravity(): void {
    this.objectStorageService.getAll().forEach(
      (circle: Circle): void => {
        const distanceToSurface: number
          = Math.abs(circle.position.y + circle.radius - this.landLevel);

        const distanceX: number = 0;
        const distanceY: number = distanceToSurface + 6_378_000;

        const distance: number = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        const force: number = this.calculateGravityForce(circle.mass, distance);

        const angle: number = Math.atan2(distanceY, distanceX);

        // Рассчитываем силу гравитации по осям X и Y
        const forceX: number = force * Math.cos(angle);
        const forceY: number = force * Math.sin(angle);

        // Рассчитываем ускорение по осям X и Y
        const accelerationX: number = forceX / circle.mass;
        const accelerationY: number = forceY / circle.mass;

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
