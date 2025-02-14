import {inject, Injectable} from "@angular/core";
import {Shape} from "../../../model/entity";
import {CircleMover} from "./mover/circle-mover";
import {ShapeMover} from "./mover/shape-mover";
import {ShapeType} from "../../../model/entity/property";

@Injectable({ providedIn: 'root' })
export class ShapeMovementStrategyService {
  private readonly circleMover = inject(CircleMover);

  private moverMap: Map<ShapeType, ShapeMover<Shape>> = this.getShapeMoverMap();

  move(shape: Shape): void {
    const mover: ShapeMover<Shape> = this.moverMap.get(shape.type);

    if (!mover) {
      return;
    }

    mover.move(shape);
    mover.rotate(shape);
  }

  private getShapeMoverMap(): Map<ShapeType, ShapeMover<Shape>> {
    const map: Map<ShapeType, ShapeMover<Shape>> = new Map<ShapeType, ShapeMover<Shape>>();

    map.set(ShapeType.circle, this.circleMover);

    return map;
  }
}
