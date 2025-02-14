import {Injectable} from "@angular/core";
import {Vector3} from "../../common/util/model/vector3";
import {Vector2} from "../../common/util/model/vector2";

export const Z_STEP_SIZE = 0.5;
export const Z_RANGE = { min: 10, max: 150 };
export const INITIAL_Z = 10;
const INITIAL_CAMERA = { x: 0, y: 0, z: INITIAL_Z };

@Injectable({
  providedIn: 'root'
})
export class AppCamera {
  private _canvasPosition!: Vector2;

  private _position: Vector3;
  private _widthPx: number;
  private _heightPx: number;
  private _width: number;
  private _height: number;

  private _scale: number;

  private zChanged: boolean = false;

  bindCanvas(canvasElement: HTMLCanvasElement): void {
    this._canvasPosition = canvasElement.getBoundingClientRect();

    const { width, height } = canvasElement.getBoundingClientRect();

    this._widthPx = width;
    this._heightPx = height;
    this._position = INITIAL_CAMERA;

    this.updateScale();
    this.resetCanvasSize(canvasElement);
  }

  get x(): number {
    return this._position.x;
  }

  get y(): number {
    return this._position.y;
  }

  get z(): number {
    return this._position.z;
  }

  set x(value: number) {
    this._position.x = value;
  }

  set y(value: number) {
    this._position.y = value;
  }

  set z(value: number) {
    this._position.z = value;
    this.updateScale();
    this.zChanged = true;
  }

  get position(): Vector3 {
    return this._position;
  }

  get widthPx(): number {
    return this._widthPx;
  }

  get heightPx(): number {
    return this._heightPx;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get canvasPosition(): Vector2 {
    return this._canvasPosition;
  }

  get scale(): number {
    return this._scale;
  }

  isZChanged(): boolean {
    const changed = this.zChanged;

    this.zChanged = false;

    return changed;
  }

  meterToPx(value: number): number {
    return value * this._scale;
  }

  pxToMeter(value: number): number {
    return value / this._scale;
  }

  moveTo(x: number, y: number): void {
    this._position.x = x;
    this._position.y = y;
  }

  moveForward(mousePosition: Vector2): void {
    if (this.z <= Z_RANGE.min) {
      return;
    }

    this.keepCursorPosition(mousePosition, (): void => { this.z -= Z_STEP_SIZE; });
  }

  moveBackward(mousePosition: Vector2): void {
    if (this.z >= Z_RANGE.max) {
      return;
    }

    this.keepCursorPosition(mousePosition, (): void => { this.z += Z_STEP_SIZE; });
  }

  private keepCursorPosition(mousePosition: Vector2, updateZFunc: () => void): void {
    const scaledWidth = this.pxToMeter(this._widthPx);
    const scaledHeight = this.pxToMeter(this._heightPx);

    updateZFunc();

    const newScaledWidth = this.pxToMeter(this._widthPx);
    const newScaledHeight = this.pxToMeter(this._heightPx);

    this.x -= (newScaledWidth - scaledWidth) * (mousePosition.x / this._widthPx);
    this.y -= (newScaledHeight - scaledHeight) * (mousePosition.y / this._heightPx);
  }

  private updateScale(): void {
    this._scale = this._widthPx / (this._position.z * 2);
    this._width = this.pxToMeter(this.widthPx);
    this._height = this.pxToMeter(this.heightPx);
  }

  private resetCanvasSize(canvasElement: HTMLCanvasElement): void {
    canvasElement.width = this._widthPx;
    canvasElement.height = this._heightPx;
  }
}
