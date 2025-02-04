import {inject, Injectable} from "@angular/core";
import {filter, map, Observable, takeUntil, tap} from "rxjs";
import {Position} from "../../common/util/model/position";
import {
  MouseDrugEventData,
  MouseEventService,
  MouseEventType,
  MouseEventData
} from "../control/mouse-event.service";
import {WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {AppCamera} from "./app-camera";
import {KeyboardEventService} from "../control/keyboard-event.service";
import {AppMouse} from "./app-mouse";
import {Vector2} from "../../common/util/model/vector2";

export const CAMERA_POSITION_GAP_Y = 2;
export const CAMERA_POSITION_GAP_X = 4;

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private readonly _camera: AppCamera = inject(AppCamera);
  private readonly mouse: AppMouse = inject(AppMouse);

  private cameraBorder: any = {
    leftBorder: -CAMERA_POSITION_GAP_X,
    topBorder: -CAMERA_POSITION_GAP_Y,
    rightBorder: WORLD_PROPERTY.width + CAMERA_POSITION_GAP_X,
    bottomBorder: WORLD_PROPERTY.height + CAMERA_POSITION_GAP_Y,
  }

  private startCameraPosition: Position;

  constructor(
    private mouseEventService: MouseEventService,
    private keyboardEventService: KeyboardEventService,
  ) {
  }

  get camera(): AppCamera {
    return this._camera;
  }

  readonly changes$: Observable<Position | null> = this.mouseEventService.mouseEvent$.pipe(
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
        case MouseEventType.WHEEL:
          if (event.direction.y < 0) {
            this.camera.moveForward(this.mouse.position);
          } else if (event.direction.y > 0) {
            this.camera.moveBackward(this.mouse.position);
          }

          return null;
        default:
          return null;
      }
    }),
  );

  subscribeKeyboardEvent(destroy: Observable<boolean>): void {
    this.keyboardEventService.keyDownEvent$.pipe(
      takeUntil(destroy),
      tap((event: any): void => {
        switch (event.event.key) {
          case 'ArrowUp':
            this.camera.moveForward(this.mouse.position);
            break;
          case 'ArrowDown':
            this.camera.moveBackward(this.mouse.position);
            break;
        }
      }),
    ).subscribe();
  }

  centralizeCamera(): void {
    this.camera.moveTo(
      WORLD_PROPERTY.width / 2 - this.camera.pxToMeter(this.camera.widthPx) / 2,
      WORLD_PROPERTY.height - (this.camera.pxToMeter(this.camera.heightPx) - 3),
    )
  }

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
