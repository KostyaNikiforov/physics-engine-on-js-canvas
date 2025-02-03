import {Injectable} from "@angular/core";
import {Vector3} from "../../common/util/model/vector3";
import {WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {CAMERA_POSITION_GAP_Y} from "./camera.service";

export type CameraOptions = {
  width: number;
  height: number;
}

const INITIAL_CAMERA = { x: 0, y: 0, z: 1 };

@Injectable({
  providedIn: 'root'
})
export class AppCamera {
  private _position: Vector3;
  private _widthPx: number;
  private _heightPx: number;
  private width: number;
  private height: number;

  bindCanvas(canvasElement: HTMLCanvasElement): void {
    const { width, height } = canvasElement.getBoundingClientRect();

    this._widthPx = width;
    this._heightPx = height;
    this._position = INITIAL_CAMERA;

    this.resetCanvasSize(canvasElement);
    this.initPosition();
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

  get pictureScale(): number {
    return 50 / this._position.z;
  }

  meterToPx(value: number): number {
    return value * this.pictureScale;
  }

  pxToMeter(value: number): number {
    return value / this.pictureScale;
  }

  private resetCanvasSize(canvasElement: HTMLCanvasElement): void {
    canvasElement.width = this._widthPx;
    canvasElement.height = this._heightPx;
  }

  private initPosition(): void {
    this._position.x = WORLD_PROPERTY.width / 2 - this.pxToMeter(this._widthPx) / 2;
    this._position.y = WORLD_PROPERTY.height / 2 - CAMERA_POSITION_GAP_Y;
  }
}
