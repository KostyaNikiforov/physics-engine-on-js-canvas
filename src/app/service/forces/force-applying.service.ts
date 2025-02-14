import {Injectable} from "@angular/core";
import {Shape} from "../../model/entity/shape";
import {LifeCircleService} from "../life-circle.service";

@Injectable({ providedIn: 'root' })
export class ForceApplyingService {
  apply(shapes: Shape[]): void {
    shapes
      .filter((shape: Shape): boolean => shape.hasForces())
      .forEach(
        (shape: Shape): void => {

          // TODO: add contact.ts resolving
          if (shape.hasContact()) {
            return;
          }

          for (let force of shape.getForces()) {
            shape.velocity.x += force.x * LifeCircleService.timeStepPerFrame;
            shape.velocity.y += force.y * LifeCircleService.timeStepPerFrame;
          }
      }
    );
  }


  /*else {
              const contact.ts: Contact = shape.contact.ts;
              const normal: Vector2 = normalizeVector({
                x: shape.centerPosition.x - contact.ts.point.x,
                y: shape.centerPosition.y - contact.ts.point.y,
              });

              const velocityDotNormal: number = dot(shape.velocity, normal);
              const velocityNormal: Vector2 = {
                x: normal.x * velocityDotNormal,
                y: normal.y * velocityDotNormal,
              };

              const velocityTangent: Vector2 = {
                x: shape.velocity.x - velocityNormal.x,
                y: shape.velocity.y - velocityNormal.y,
              };

              shape.velocity.x = velocityTangent.x + force.x * LifeCircleService.timeStepPerFrame;
              shape.velocity.y = velocityTangent.y + force.y * LifeCircleService.timeStepPerFrame;
            }*/
}
