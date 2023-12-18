import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Shape} from "../model/shape";
import {FPS, SCALE} from "./canvas.component";
import {Circle} from "../model/circle";

const AIR_RESISTANCE = 0.999;

@Injectable({
  providedIn: 'root'
})
export class AirResistanceService {
  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  updateVelocities(): void {
    this.objectStorageService.getAll().forEach(
      (circle: Circle): void => {
        circle.velocity.x *= AIR_RESISTANCE;
        circle.velocity.y *= AIR_RESISTANCE;
      }
    );
  }
}
