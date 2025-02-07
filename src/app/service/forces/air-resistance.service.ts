import {Injectable} from "@angular/core";
import {LifeCircleService} from "../life-circle.service";
import {PhysicUtil} from "../../common/physic.util";
import {getVectorMagnitude} from "../../common/util/vector.util";
import {Shape, ShapeType} from "../../model/shape";
import {Circle} from "../../model/circle";
import {Vector2} from "../../common/util/model/vector2";

const AIR_DENSITY = 1.225; // кг/м^3
const WATER_DENSITY = 997; // кг/м^3
const RESISTANCE_COEFFICIENT = 0.47; // для шара

@Injectable({ providedIn: 'root' })
export class AirResistanceService {
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

    circle.velocity.x += A * -direction.x * LifeCircleService.timeStepPerFrame;
    circle.velocity.y += A * -direction.y * LifeCircleService.timeStepPerFrame;
  }
}
