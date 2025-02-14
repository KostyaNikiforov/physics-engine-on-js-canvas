import {Vector2} from "../../../common/util/model/vector2";
import {Shape} from "../shape";
import {IdUtil} from "../../../common/util/id.util";

type OverlapInput = {
  points: Vector2[];
  depth: number;
  normal: Vector2;
  shape: Shape;
};

export class Overlap {
  private readonly _id: string;
  private readonly _points: Vector2[];
  private readonly _depth: number;
  private readonly _normal: Vector2;
  private readonly _shape: Shape;

  private constructor(
    id: string,
    points: Vector2[],
    depth: number,
    normal: Vector2,
    shape: Shape,
  ) {
    this._id = id;
    this._points = points;
    this._depth = depth;
    this._normal = normal;
    this._shape = shape;
  }

  static of(input: OverlapInput): Overlap {
    return new Overlap(
      IdUtil.generate(),
      input.points,
      input.depth,
      input.normal,
      input.shape,
    );
  }

  get id(): string {
    return this._id;
  }

  get points(): Vector2[] {
    return this._points;
  }

  get normal(): Vector2 {
    return this._normal;
  }

  get depth(): number {
    return this._depth;
  }

  get shape(): Shape {
    return this._shape;
  }
}
