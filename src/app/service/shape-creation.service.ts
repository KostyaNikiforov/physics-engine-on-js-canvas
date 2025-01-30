import {Injectable} from "@angular/core";
import {MouseClickEventData, MouseEventData, MouseEventService, MouseEventType} from "./control/mouse-event.service";
import {filter, Observable, tap} from "rxjs";
import {ObjectStorageService} from "./world/object-storage.service";
import {Position} from "../common/util/model/position";
import {ShapeType} from "../model/shape";
import {Camera} from "../common/util/model/camera";
import {CameraService} from "./rendar/camera.service";
import {ShapeFactoryService} from "./shape-factory.service";

@Injectable({
  providedIn: 'root'
})
export class ShapeCreationService {
  private boundingCanvasRect: DOMRect;

  constructor(
    private mouseEventService: MouseEventService,
    private objectStorageService: ObjectStorageService,
    private cameraService: CameraService,
    private shapeFactoryService: ShapeFactoryService,
  ) {
  }

  handleCreationActionOnCanvas(canvas: HTMLCanvasElement): Observable<MouseEventData> {
    this.boundingCanvasRect = canvas.getBoundingClientRect();

    return this.mouseEventService.mouseClickEvent$.pipe(
      tap(this.handleClick.bind(this))
    );
  }

  private handleClick(eventData: MouseClickEventData): void {
    this.objectStorageService.add(
      this.shapeFactoryService.create(
        ShapeType.circle,
        this.mouseEventToPosition(eventData.position),
        {
          radius: 0.2,
          speed: 15,
          direction: {
            x: 1, // Math.random() * 2 - 1,
            y: 0, //Math.random() * 2 - 1,
          },
        }
      )
    );
  }

  private mouseEventToPosition(position: Position): Position {
    const camera: Camera = this.cameraService.camera;

    return {
      x: this.cameraService.toMeter(position.x - this.boundingCanvasRect.left) + camera.position.x,
      y: this.cameraService.toMeter(position.y - this.boundingCanvasRect.top) + camera.position.y,
    };
  }
}
