import {Vector2} from "../common/util/model/vector2";

export interface ShapeProperties {
  radius?: number;
  direction?: Vector2;
  speed?: number;
  polygons?: Vector2[];
}
