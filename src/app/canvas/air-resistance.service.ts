import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Circle} from "../model/circle";

const AIR_RESISTANCE = 0.999;

@Injectable({
  providedIn: 'root'
})
export class AirResistanceService {
  private airResistance: number = AIR_RESISTANCE;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  setAirResistance(airResistance: number): void {
    if (airResistance < 0 || airResistance > 1) {
      throw new Error('Air resistance must be between 0 and 1');
    }

    this.airResistance = airResistance;
  }

  updateVelocities(): void {
    this.objectStorageService.getAll().forEach(
      (circle: Circle): void => {
        circle.velocity.x *= this.airResistance;
        circle.velocity.y *= this.airResistance;
      }
    );
  }
}
