import {Injectable} from "@angular/core";
import {Vector3} from "../../common/util/model/vector3";
import {WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {CAMERA_POSITION_GAP_Y} from "./camera.service";
import {Vector2} from "../../common/util/model/vector2";

@Injectable({ providedIn: 'root' })
export class AppMouse {
  private _positionX: number;
  private _positionY: number;

  resetMousePosition(x: number, y: number): void {
    this._positionX = x;
    this._positionY = y;
  }

  get position(): Vector2 {
    return { x: this._positionX, y: this._positionY };
  }

  get x(): number {
    return this._positionX;
  }

  get y(): number {
    return this._positionY;
  }
}
