import {Injectable} from "@angular/core";
import {Shape} from "../../model/shape";

@Injectable({ providedIn: 'root' })
export class MovementService {
  move(shapes: Shape[]): void {
      shapes.forEach(this.moveShape.bind(this));
  }

  private moveShape(shape: Shape): void {
    shape.move();
    shape.rotate();
  }
}
