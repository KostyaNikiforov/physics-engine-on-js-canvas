import {Injectable} from "@angular/core";
import {ShapeProperties} from "../model/shape-properties";
import {Circle, Shape, Square} from "../model/entity";
import {MaterialType} from "../model/material";
import {Vector2} from "../common/util/model/vector2";
import {ShapeType} from "../model/entity/property";

const DEGREES_POINT = Math.PI / 180;
const DENSITY = 7.8 // Metal density in g/cm^3;

@Injectable({
  providedIn: 'root'
})
export class ShapeFactoryService {
  create(
    type: ShapeType,
    position: Vector2,
    properties: ShapeProperties,
    materialType?: MaterialType,
  ): Shape {
    switch (type) {
      case ShapeType.circle:
        return this.createCircle(position, properties);
      case ShapeType.square:
        return this.createSquare(position, properties, materialType);
      default:
        throw new Error('Unknown shape type');
    }
  }

  private createCircle(
    position: Vector2,
    properties: ShapeProperties,
  ): Circle {
    return new Circle(
      position,
      properties.radius,
      properties.speed,
      properties.direction,
    );
  }

  private createSquare(
    centerPosition: Vector2,
    properties: ShapeProperties,
    materialType?: MaterialType,
  ): Shape {
    return new Square(
      centerPosition,
      properties.size,
      properties.speed || 0,
      properties.direction || {
        x: 0,
        y: 0,
      },
      materialType,
    );
  }
}
