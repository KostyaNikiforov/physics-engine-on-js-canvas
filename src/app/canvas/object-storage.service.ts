import {Injectable} from "@angular/core";
import {Shape} from "../model/shape";
import {Position} from "../common/util/model/position";
import {Circle} from "../model/circle";

@Injectable({
  providedIn: 'root'
})
export class ObjectStorageService {
  private objects: Shape[] = [];

  add(shape: Shape): void {
    this.objects.push(shape);
  }

  getAll(): Shape[] {
    return this.objects;
  }

  removeAll(): void {
    this.objects = [];
  }

  hasShapeOnThisPosition(position: Position): boolean {
    return this.objects.some(
      (shape: Shape): boolean => this.isPositionInShape(position, shape)
    );
  }

  getElementByPosition(position: Position): Shape {
    return this.objects.find(
      (shape: Shape): boolean => this.isPositionInShape(position, shape)
    );
  }

  private isPositionInShape(position: Position, shape: Shape): boolean {
    switch (shape.type) {
      case 'circle':
        return this.isPositionInCircle(position, shape as Circle);
      default:
        throw new Error('Unknown shape type');
    }
  }

  private isPositionInCircle(position: Position, circle: Circle): boolean {
    const distance: number = Math.hypot(
      position.x - circle.position.x,
      position.y - circle.position.y,
    );

    return distance < circle.radius;
  }
}
