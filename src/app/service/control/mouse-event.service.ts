import {Injectable} from "@angular/core";
import {filter, fromEvent, map, mergeWith, Observable, tap} from "rxjs";
import {Position} from "../../common/util/model/position";
import {Vector2} from "../../common/util/model/vector2";

const EVENT_NAME = {
  mouseDown: 'mousedown',
  mouseMove: 'mousemove',
  mouseUp: 'mouseup',
}

export interface MouseEventData {
  type: MouseEventType;
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
  private readonly mouseMoveEvent$: Observable<MouseEvent>
    = fromEvent(document, EVENT_NAME.mouseMove).pipe(
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

  readonly mouseEvent$: Observable<MouseEventData>
    = this.getMouseEvent();

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
      map((event: MouseEvent): MouseEventData => {
        switch (event.type) {
          case EVENT_NAME.mouseDown:
            this.mouseDownTime = Date.now();
            this.mouseDownPosition = this.mouseEventToPosition(event);

            return {
              type: MouseEventType.DOWN,
              position: {
                x: event.clientX,
                y: event.clientY,
              },
            };
          case EVENT_NAME.mouseUp:
            this.mouseDownPosition = null;

            if (Date.now() - this.mouseDownTime < 200) {
              return {
                type: MouseEventType.CLICK,
                position: {
                  x: event.clientX,
                  y: event.clientY,
                }
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
              position: this.mouseEventToPosition(event),
              vector: {
                x: event.clientX - this.mouseDownPosition.x,
                y: event.clientY - this.mouseDownPosition.y,
              }
            } as MouseDrugEventData;
          default:
              return null;
        }
      }),
      filter((event: MouseEventData): boolean => !!event),
    );
  }

  private mouseEventToPosition(event: MouseEvent): Position {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  private filterCanvasMouseEvent(event: MouseEvent): boolean {
    return (event.target as HTMLElement).className === 'canvas';
  }
}

export enum MouseEventType {
  CLICK = 'click',
  DOWN = 'down',
  DRUG = 'drug',
}
