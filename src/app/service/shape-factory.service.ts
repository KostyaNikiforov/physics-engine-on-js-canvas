import {Injectable} from "@angular/core";
import {Shape, ShapeType} from "../model/shape";
import {Position} from "../common/util/model/position";
import {ShapeProperties} from "../model/shape-properties";
import {Circle} from "../model/circle";
import {Polygon} from "../model/polygon";

const DEGREES_POINT = Math.PI / 180;
const DENSITY = 7.8 // Metal density in g/cm^3;

@Injectable({
  providedIn: 'root'
})
export class ShapeFactoryService {
  create(
    type: ShapeType,
    position: Position,
    properties: ShapeProperties
  ): Shape {
    console.log('New shape', type, properties);

    switch (type) {
      case ShapeType.circle:
        return this.createCircle(position, properties);
      case ShapeType.polygon:
        return this.createRectangle(position, properties);
      default:
        throw new Error('Unknown shape type');
    }
  }

  private createCircle(
    position: Position,
    properties: ShapeProperties,
  ): Circle {
    return new Circle(
      position,
      properties.radius,
      properties.speed,
      properties.direction,
    );
  }

  private createRectangle(
    position: Position,
    properties: ShapeProperties,
  ): Shape {
    return new Polygon(
      position,
      properties.polygons,
      properties.speed || 0,
      properties.direction || {
        x: 0,
        y: 0,
      },
    );
  }
}
