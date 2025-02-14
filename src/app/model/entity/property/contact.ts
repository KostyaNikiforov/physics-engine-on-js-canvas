import {Vector2} from "../../../common/util/model/vector2";
import {Shape} from "../shape";
import {IdUtil} from "../../../common/util/id.util";

type ContactInput = {
  point: Vector2;
  normal: Vector2;
  shape: Shape;
};

export class Contact {
  private readonly _id: string;
  private readonly _point: Vector2;
  private readonly _normal: Vector2;
  private readonly _shape: Shape;

  private constructor(
    id: string,
    point: Vector2,
    normal: Vector2,
    shape: Shape,
  ) {
    this._id = id;
    this._point = point;
    this._normal = normal;
    this._shape = shape;
  }

  static of(input: ContactInput): Contact {
    return new Contact(
      IdUtil.generate(),
      input.point,
      input.normal,
      input.shape,
    );
  }

  get id(): string {
    return this._id;
  }

  get point(): Vector2 {
    return this._point;
  }

  get normal(): Vector2 {
    return this._normal;
  }

  get shape(): Shape {
    return this._shape;
  }
}
