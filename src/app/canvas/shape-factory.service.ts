import {Injectable} from "@angular/core";
import {Shape, ShapeType} from "../model/shape";
import {Position} from "../common/util/model/position";
import {ShapeProperties} from "../model/shape-properties";
import {Circle} from "../model/circle";

const INITIAL_DIRECTION_DEGREES = 90;
const INITIAL_SPEED = 3; // px per frame

@Injectable({
  providedIn: 'root'
})
export class ShapeFactoryService {
  create(
    type: ShapeType,
    position: Position,
    properties: ShapeProperties
  ): Shape {
    const radius: number = Math.random() * 30 + 1;

    switch (type) {
      case ShapeType.circle:
        return {
          type: ShapeType.circle,
          position: position,
          radius: radius,
          direction: 0,
          speed: 0,
          color: 'red',
          mass: radius,
          velocity: {
            x: Math.random() * 500 - 250,
            y: Math.random() * 500 - 250,
          },
        } as Circle;
    }
  }
}
