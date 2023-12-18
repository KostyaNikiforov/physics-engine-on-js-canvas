import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Shape} from "../model/shape";
import {FPS} from "./canvas.component";

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private readonly timeStep: number = 1 / FPS;

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
