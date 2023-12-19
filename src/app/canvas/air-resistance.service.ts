import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Circle} from "../model/circle";
import {getVectorMagnitude} from "../common/util/vector.util";
import {FPS} from "./canvas.component";
import {Vector} from "../common/util/model/vector";

const AIR_DENSITY = 1.225; // кг/м^3
const RESISTANCE_COEFFICIENT = 0.47; // для шара

@Injectable({
  providedIn: 'root'
})
export class AirResistanceService {
  private timeStep: number = 1 / FPS;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  updateVelocities(): void {
    this.objectStorageService.getAll().forEach(
      (circle: Circle): void => {
        const circleSpeed: number = getVectorMagnitude(circle.velocity);
        const resistanceForce: number = (AIR_DENSITY * circle.square * RESISTANCE_COEFFICIENT * Math.pow(circleSpeed, 2)) / 2;
        const A: number = resistanceForce / circle.mass;

        circle.velocity.x += A * -circle.velocity.x * this.timeStep;
        circle.velocity.y += A * -circle.velocity.y * this.timeStep;
      }
    );
  }
}
