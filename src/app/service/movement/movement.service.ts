import {inject, Injectable} from "@angular/core";
import {Circle, Shape} from "../../model/entity";
import {ShapeMovementStrategyService} from "./shape-movement-strategy/shape-movement-strategy.service";

@Injectable({ providedIn: 'root' })
export class MovementService {
  private readonly shapeMovementStrategyService = inject(ShapeMovementStrategyService);

  move(shapes: Shape[]): void {
    shapes.forEach(
      this.shapeMovementStrategyService.move.bind(this.shapeMovementStrategyService)
    );
  }
}
