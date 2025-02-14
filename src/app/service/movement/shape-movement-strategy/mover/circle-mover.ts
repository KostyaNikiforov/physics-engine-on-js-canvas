import {ShapeMover} from "./shape-mover";
import {Injectable} from "@angular/core";
import {Circle} from "../../../../model/entity";
import {Vector2} from "../../../../common/util/model/vector2";
import {LifeCircleService} from "../../../life-circle.service";
import {Contact, Overlap} from "../../../../model/entity/property";

@Injectable({ providedIn: 'root' })
export class CircleMover implements ShapeMover<Circle> {
  move(circle: Circle): void {
    if (circle.hasOverlap()) {
      circle.overlaps
        .forEach((overlap: Overlap): void => this.handleOverlap(circle, overlap));
    } else {
      circle.moveOn({
        x: circle.velocity.x * LifeCircleService.timeStepPerFrame,
        y: circle.velocity.y * LifeCircleService.timeStepPerFrame,
      });
    }
  }

  rotate(circle: Circle): void {
    circle.rotationState += circle.rotation.radiansPerSecond;

    circle.rotateOn(circle.rotation.radiansPerSecond);
  }

  private handleOverlap(circle: Circle, overlap: Overlap): void {
    const overlapPoint: Vector2 = overlap.points[0];

    circle.moveOn({
      x: (circle.velocity.x * LifeCircleService.timeStepPerFrame) + overlap.normal.x * overlap.depth,
      y: (circle.velocity.y * LifeCircleService.timeStepPerFrame) + overlap.normal.y * overlap.depth,
    });

    circle.addContact(Contact.of({
      point: { x: overlapPoint.x, y: overlapPoint.y },
      normal: overlap.normal,
      shape: overlap.shape,
    }));

    circle.removeOverlap(overlap.id);
  }
}
