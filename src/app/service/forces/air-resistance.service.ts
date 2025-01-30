import {Injectable} from "@angular/core";
import {ObjectStorageService} from "../world/object-storage.service";
import {LifeCircleService} from "../world/life-circle.service";
import {PhysicUtil} from "../../common/physic.util";
import {getVectorMagnitude} from "../../common/util/vector.util";
import {Shape, ShapeType} from "../../model/shape";
import {Circle} from "../../model/circle";

const AIR_DENSITY = 1.225; // кг/м^3
const RESISTANCE_COEFFICIENT = 0.47; // для шара

@Injectable({
  providedIn: 'root'
})
export class AirResistanceService {
  private readonly airDensity: number = AIR_DENSITY;

  private readonly resistanceCoefficient: number = RESISTANCE_COEFFICIENT;

  constructor(
    private objectStorageService: ObjectStorageService,
  ) {
  }

  apply(): void {
    this.objectStorageService.getAll().forEach(
      (shape: Shape): void => {
        if (shape.type !== ShapeType.circle) {
          return;
        }

        const circle: Circle = shape as Circle;

        const resistanceForce: number = PhysicUtil.calculateResistanceForce(
          this.airDensity,
          circle.square,
          this.resistanceCoefficient,
          getVectorMagnitude(circle.velocity),
        );
        const A: number = resistanceForce / circle.mass;

        circle.velocity.x += A * -circle.velocity.x * LifeCircleService.timeStepPerFrame;
        circle.velocity.y += A * -circle.velocity.y * LifeCircleService.timeStepPerFrame;
      }
    );
  }
}
