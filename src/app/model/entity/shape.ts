import {Vector2} from "../../common/util/model/vector2";
import {copyVector, getVectorMagnitude, multiplyVector, normalizeVector} from "../../common/util/vector.util";
import {MathUtil} from "../../common/util/math.util";
import {ShapeRotation, Overlap, Contact, ShapeType} from "./property";
import {ArrayUtil} from "../../common/util/array.util";

export abstract class Shape {
  private readonly _mass: number;
  private readonly _type: ShapeType;

  private _rotation: ShapeRotation;
  private _velocity: Vector2;
  private _position: Vector2;

  private _overlaps: Overlap[];
  private _contacts: Contact[];
  private _forces: Map<string, Vector2>;
  private _nextPosition: Vector2;

  constructor(
    position: Vector2,
    type: ShapeType,
    speed: number,
    direction: Vector2,
    mass: number,
  ) {
    this._position = position;
    this._type = type;
    this._mass = mass;
    this._rotation = {
      radiansPerSecond: 0,
      point: copyVector(position),
    };

    this._forces = new Map();
    this._contacts = ArrayUtil.empty();
    this._overlaps = ArrayUtil.empty();
    this._velocity = multiplyVector(direction, speed);
  }

  // TODO: cache this value
  direction(): Vector2 {
    return normalizeVector(this._velocity);
  }

  abstract moveOn(vector: Vector2): void;
  abstract rotateOn(degree: number): void;

  getSpeed(): number {
    return getVectorMagnitude(this._velocity);
  }

  setRotationSpeedInDegrees(degreesPerSecond: number): void {
    this.rotation.radiansPerSecond = MathUtil.degreesToRadians(degreesPerSecond);
  }

  setRotationSpeed(radiansPerSecond: number): void {
    this.rotation.radiansPerSecond = radiansPerSecond;
  }

  setRotationPoint(point: Vector2): void {
    this.rotation.point = point;
  }

  get contacts(): Contact[] {
    return this._contacts;
  }

  hasContact(): boolean {
    return this._contacts.length > 0;
  }

  addContact(contact: Contact): void {
    this._contacts.push(contact);
  }

  setForce(forceId: string, vector: Vector2): void {
    this._forces.set(forceId, vector);
  }

  removeContact(id: string): void {
    this._contacts = this._contacts.filter((contact: Contact): boolean => contact.id !== id);
  }

  getForces(): Vector2[] {
    return Array.from(this._forces.values());
  }

  hasForces(): boolean {
    return this._forces.size > 0;
  }

  get overlaps(): Overlap[] {
    return this._overlaps;
  }

  hasOverlap(): boolean {
    return this._overlaps.length > 0;
  }

  addOverlap(overlap: Overlap): void {
    this._overlaps.push(overlap);
  }

  removeOverlap(id: string): void {
    this._overlaps = this._overlaps.filter((overlap: Overlap): boolean => overlap.id !== id);
  }

  get rotation(): ShapeRotation {
    return this._rotation;
  }

  set nextPosition(position: Vector2) {
    this._nextPosition = position;
  }

  get nextPosition(): Vector2 {
    return this._nextPosition;
  }

  get mass(): number {
    return this._mass;
  }

  get type(): ShapeType {
    return this._type;
  }

  get velocity(): Vector2 {
    return this._velocity;
  }

  get position(): Vector2 {
    return this._position;
  }

  set velocity(vector: Vector2) {
    this._velocity = vector;
  }

  clearAllForce(): void {
    this._forces.clear();
  }
}
