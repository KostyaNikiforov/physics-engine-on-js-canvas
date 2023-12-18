import {Position} from "../common/util/model/position";
import {Vector} from "../common/util/model/vector";

export interface Shape {
  position: Position;
  type: ShapeType;
  color: string;
  mass: number;
  velocity: Vector;
}

export enum ShapeType {
  circle = 'circle',
}
