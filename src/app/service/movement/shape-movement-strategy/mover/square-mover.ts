import {ShapeMover} from "./shape-mover";
import {Injectable} from "@angular/core";
import {Circle, Square} from "../../../../model/entity";
import {LifeCircleService} from "../../../life-circle.service";

@Injectable({ providedIn: 'root' })
export class CircleMover implements ShapeMover<Square> {
  move(square: Square): void {
    const moveCoefficientX: number = square.velocity.x * LifeCircleService.timeStepPerFrame;
    const moveCoefficientY: number = square.velocity.y * LifeCircleService.timeStepPerFrame;

    square.moveOn({
      x: moveCoefficientX,
      y: moveCoefficientY,
    });
  }

  rotate(square: Square): void {
    if (!square.rotation?.radiansPerSecond) {
      return;
    }

    square.rotateOn(square.rotation.radiansPerSecond);
  }
}
