import {Injectable} from "@angular/core";
import {PhysicUtil} from "../../common/util/physic.util";
import {getVectorMagnitude} from "../../common/util/vector.util";
import {Shape} from "../../model/entity";
import {Circle} from "../../model/entity";
import {Vector2} from "../../common/util/model/vector2";
import {ShapeType} from "../../model/entity/property";

const AIR_DENSITY = 1.225; // кг/м^3
const WATER_DENSITY = 997; // кг/м^3
const RESISTANCE_COEFFICIENT = 0.47; // для шара

@Injectable({ providedIn: 'root' })
export class AirResistanceService {
  private readonly forceName: string = 'air-resistance';

  apply(shapes: Shape[]): void {
    shapes.forEach(
      (shape: Shape): void => {
        if (shape.type === ShapeType.circle) {
          const circle: Circle = shape as Circle;

          this.applyCircle(circle);
        }
      }
    );
  }

  private applyCircle(circle: Circle): void {
    const resistanceForce: number = PhysicUtil.calculateResistanceForce(
      AIR_DENSITY,
      circle.square,
      RESISTANCE_COEFFICIENT,
      getVectorMagnitude(circle.velocity),
    );
    const A: number = resistanceForce / circle.mass;
    const direction: Vector2 = circle.direction();

    circle.setForce(
      this.forceName,
      { x: A * -direction.x, y: A * -direction.y }
    );
  }
}
