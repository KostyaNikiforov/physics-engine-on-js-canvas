import {Injectable} from "@angular/core";
import {ObjectStorageService} from "./object-storage.service";
import {Shape, ShapeType} from "../../model/shape";
import {Circle} from "../../model/circle";

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  move(isRotationEnabled: boolean): void {
    this.objectStorageService.getAll()
      .forEach((shape: Shape): void => {
        shape.move();

        if (shape.type !== ShapeType.circle) {
          return;
        }

        const circle: Circle = shape as Circle;

        if (isRotationEnabled) {
          circle.rotate()
        }
      });
  }
}
