import {Injectable} from "@angular/core";
import {Shape, ShapeType} from "../model/shape";
import {Position} from "../common/util/model/position";
import {ShapeProperties} from "../model/shape-properties";
import {Circle} from "../model/circle";

const DEGREES_POINT = Math.PI / 180;

@Injectable({
  providedIn: 'root'
})
export class ShapeFactoryService {
  create(
    type: ShapeType,
    position: Position,
    properties: ShapeProperties
  ): Shape {
    console.log('New circle with radius', properties.radius);

    switch (type) {
      case ShapeType.circle:
        return {
          type: ShapeType.circle,
          position: position,
          radius: properties.radius,
          color: 'black',
          mass: Math.pow(properties.radius, 2) * Math.PI,
          velocity: {
            x: properties.speed * Math.cos(properties.direction * DEGREES_POINT),
            y: properties.speed * Math.sin(properties.direction * DEGREES_POINT),
          },
        } as Circle;
    }
  }
}
