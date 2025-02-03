import {inject, Injectable} from "@angular/core";
import {filter, map, Observable, tap} from "rxjs";
import {Position} from "../../common/util/model/position";
import {
  MouseDrugEventData,
  MouseEventService,
  MouseEventType,
  MouseEventData
} from "../control/mouse-event.service";
import {WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {AppCamera} from "./app-camera.service";

export const CAMERA_POSITION_GAP_Y = 2;
export const CAMERA_POSITION_GAP_X = 4;

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private readonly _camera: AppCamera = inject(AppCamera);

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

  get camera(): AppCamera {
    return this._camera;
  }

  readonly changes$: Observable<any>
    = this.mouseEventService.mouseEvent$.pipe(
      map((event: MouseEventData): Position => {
        switch (event.type) {
          case MouseEventType.DOWN:
            this.startCameraPosition = {
              x: this._camera.position.x,
              y: this._camera.position.y,
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
      x: this.startCameraPosition.x - this._camera.pxToMeter(mouseDrugEventData.vector.x),
      y: this.startCameraPosition.y - this._camera.pxToMeter(mouseDrugEventData.vector.y),
    }
  }

  private updateCameraPosition(position: Position): void {
    this._camera.position.x = position.x;
    this._camera.position.y = position.y;
  }
}
