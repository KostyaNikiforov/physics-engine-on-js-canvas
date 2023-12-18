import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Shape} from "../model/shape";
import {FPS, SCALE} from "./canvas.component";

const X_PER_DEGREES: number = Math.PI / 180

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private readonly timeStep: number = 1 / FPS;

  private readonly minVelocity: number = 0.1;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  updatePositions(): void {
    this.objectStorageService.getAll().forEach(
      (shape: Shape): void => {
        shape.position.x += shape.velocity.x * this.timeStep;
        shape.position.y += shape.velocity.y * this.timeStep;
      }
    );
  }
}
