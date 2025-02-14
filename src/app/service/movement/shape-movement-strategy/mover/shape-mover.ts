import {Shape} from "../../../../model/entity";

export interface ShapeMover<T extends Shape> {
  move(shape: T): void;
  rotate(shape: T): void;
}
