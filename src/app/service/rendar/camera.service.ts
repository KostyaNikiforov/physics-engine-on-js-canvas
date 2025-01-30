import {Injectable} from "@angular/core";
import {filter, map, Observable, tap} from "rxjs";
import {Position} from "../../common/util/model/position";
import {Camera} from "../../common/util/model/camera";
import {
  MouseDrugEventData,
  MouseEventService,
  MouseEventType,
  MouseEventData
} from "../control/mouse-event.service";
import {WORLD_PROPERTY} from "../../canvas-page/canvas.component";

export const CAMERA_PROPERTY = {
  width: 1200,
  height: 600,
}
const CAMERA_POSITION_GAP_Y = 2;
const CAMERA_POSITION_GAP_X = 4;

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private __camera: Camera = {
    position: {
      x: WORLD_PROPERTY.width / 2 - this.toMeter(CAMERA_PROPERTY.width / 2),
      y: WORLD_PROPERTY.height - this.toMeter(CAMERA_PROPERTY.height) + CAMERA_POSITION_GAP_Y,
      z: 2,
    },
    width:  this.toMeter(CAMERA_PROPERTY.width),
    height: this.toMeter(CAMERA_PROPERTY.height),
  };

  private cameraBorder: any = {
    leftBorder: -CAMERA_POSITION_GAP_X,
    topBorder: -CAMERA_POSITION_GAP_Y,
    rightBorder: WORLD_PROPERTY.width + CAMERA_POSITION_GAP_X,
    bottomBorder: WORLD_PROPERTY.height + CAMERA_POSITION_GAP_Y,
  }

  private startCameraPosition: Position;

  constructor(
    private mouseEventService: MouseEventService,
  ) {
  }

  get camera(): Camera {
    return this.__camera;
  }

  get pictureScale(): number {
    return 50 / (this.__camera ? this.__camera.position.z : 2);
  }

  toPx(value: number): number {
    return value * this.pictureScale;
  }

  toMeter(value: number): number {
    return value / this.pictureScale;
  }

  readonly changes$: Observable<any>
    = this.mouseEventService.mouseEvent$.pipe(
      map((event: MouseEventData): Position => {
        switch (event.type) {
          case MouseEventType.DOWN:
            this.startCameraPosition = {
              x: this.__camera.position.x,
              y: this.__camera.position.y,
            }
            return null;
          case MouseEventType.DRUG:
            const newCameraPosition: Position
              = this.toNewCameraPosition(event as MouseDrugEventData)

            this.updateCameraPosition(newCameraPosition)
            return newCameraPosition;
          default:
            return null;
        }
      }),
      filter((position: Position): boolean => !!position),
    );

  private toNewCameraPosition(mouseDrugEventData: MouseDrugEventData): Position {
    return {
      x: this.startCameraPosition.x - this.toMeter(mouseDrugEventData.vector.x),
      y: this.startCameraPosition.y - this.toMeter(mouseDrugEventData.vector.y),
    }
  }

  private updateCameraPosition(position: Position): void {
    this.__camera.position.x = position.x;
    this.__camera.position.y = position.y;
  }
}
