import {inject, Injectable} from "@angular/core";
import {filter, fromEvent, map, mergeWith, Observable, tap} from "rxjs";
import {Position} from "../../common/util/model/position";
import {Vector2} from "../../common/util/model/vector2";
import {AppMouse} from "../rendar/app-mouse";
import {AppCamera} from "../rendar/app-camera";

const EVENT_NAME = {
  mouseDown: 'mousedown',
  mouseMove: 'mousemove',
  mouseUp: 'mouseup',
  mouseWheel: 'wheel',
}

export interface MouseEventData {
  type: MouseEventType;
  direction?: Vector2;
  position: Position;
}

export interface MouseClickEventData extends MouseEventData {
  type: MouseEventType.CLICK;
}

export interface MouseDrugEventData extends MouseEventData {
  type: MouseEventType.DRUG;
  startPosition: Position;
  vector: Vector2;
}

@Injectable({
  providedIn: 'root'
})
export class MouseEventService {
  private readonly mouse: AppMouse = inject(AppMouse);
  private readonly camera: AppCamera = inject(AppCamera);

  private readonly mouseMoveEvent$: Observable<MouseEvent>
    = fromEvent(document, EVENT_NAME.mouseMove).pipe(
      filter(this.filterCanvasMouseEvent.bind(this)),
    ) as Observable<MouseEvent>;

  private readonly mouseWheelEvent$: Observable<MouseEvent>
    = fromEvent(document, EVENT_NAME.mouseWheel).pipe(
    filter(this.filterCanvasMouseEvent.bind(this)),
  ) as Observable<MouseEvent>;

  private readonly mouseUpEvent$: Observable<MouseEvent>
    = fromEvent(document, EVENT_NAME.mouseUp).pipe(
      filter(this.filterCanvasMouseEvent.bind(this)),
    ) as Observable<MouseEvent>;

  private readonly mouseDownEvent$: Observable<MouseEvent>
    = fromEvent(document, EVENT_NAME.mouseDown).pipe(
      filter(this.filterCanvasMouseEvent.bind(this)),
    ) as Observable<MouseEvent>;

  readonly mouseEvent$: Observable<MouseEventData> = this.getMouseEvent();

  readonly mouseClickEvent$: Observable<MouseClickEventData>
    = this.mouseEvent$.pipe(
      filter((event: MouseEventData): boolean => event.type === MouseEventType.CLICK),
      map((event: MouseEventData): MouseClickEventData => event as MouseClickEventData),
    );

  private mouseDownPosition: Position;

  private mouseDownTime: number;

  private getMouseEvent(): Observable<MouseEventData> {
    return this.mouseDownEvent$.pipe(
      mergeWith(this.mouseUpEvent$),
      mergeWith(this.mouseMoveEvent$),
      mergeWith(this.mouseWheelEvent$),
      map((event: MouseEvent): MouseEventData => {
        event.stopPropagation();

        this.resetMousePositionOnCanvas(event);

        switch (event.type) {
          case EVENT_NAME.mouseDown:
            this.mouseDownTime = Date.now();
            this.mouseDownPosition = { x: this.mouse.x, y: this.mouse.y };

            return {
              type: MouseEventType.DOWN,
              position: { x: this.mouse.x, y: this.mouse.y },
            };
          case EVENT_NAME.mouseUp:
            this.mouseDownPosition = null;

            if (Date.now() - this.mouseDownTime < 200) {
              return {
                type: MouseEventType.CLICK,
                position: { x: this.mouse.x, y: this.mouse.y },
              } as MouseClickEventData;
            }

            return null;
          case EVENT_NAME.mouseMove:
            if (!this.mouseDownPosition) {
              return null;
            }

            return {
              type: MouseEventType.DRUG,
              startPosition: this.mouseDownPosition,
              position: { x: this.mouse.x, y: this.mouse.y },
              vector: {
                x: this.mouse.x - this.mouseDownPosition.x,
                y: this.mouse.y - this.mouseDownPosition.y,
              }
            } as MouseDrugEventData;
          case EVENT_NAME.mouseWheel:
            return {
              type: MouseEventType.WHEEL,
              direction: {
                x: (event as WheelEvent).deltaX,
                y: (event as WheelEvent).deltaY,
              },
              position: this.mouse.position,
            };
          default:
              return null;
        }
      }),
      filter((event: MouseEventData): boolean => !!event),
    );
  }

  private filterCanvasMouseEvent(event: MouseEvent): boolean {
    return (event.target as HTMLElement).className === 'canvas';
  }

  private resetMousePositionOnCanvas(event: MouseEvent): void {
    this.mouse.resetMousePosition(
      event.clientX - this.camera.canvasPosition.x,
      event.clientY - this.camera.canvasPosition.y,
    );
  }
}

export enum MouseEventType {
  CLICK = 'click',
  DOWN = 'down',
  DRUG = 'drug',
  WHEEL = 'wheel',
}
