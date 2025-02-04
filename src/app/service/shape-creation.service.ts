import {inject, Injectable} from "@angular/core";
import {MouseClickEventData, MouseEventData, MouseEventService} from "./control/mouse-event.service";
import { Observable, tap} from "rxjs";
import {ObjectStorageService} from "./world/object-storage.service";
import {Position} from "../common/util/model/position";
import {ShapeType} from "../model/shape";
import {ShapeFactoryService} from "./shape-factory.service";
import {AppCamera} from "./rendar/app-camera";
import {ToolBarService} from "./control/tool-bar.service";
import {AppMouse} from "./rendar/app-mouse";

@Injectable({
  providedIn: 'root'
})
export class ShapeCreationService {
  private camera: AppCamera = inject(AppCamera);
  private mouse: AppMouse = inject(AppMouse);
  private toolBarService: ToolBarService = inject(ToolBarService);

  private boundingCanvasRect: DOMRect;

  constructor(
    private mouseEventService: MouseEventService,
    private objectStorageService: ObjectStorageService,
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
          radius: this.toolBarService.radius / 10,
          speed: 0,
          direction: {
            x: 0,
            y: 0,
          },
        }
      )
    );
  }

  private mouseEventToPosition(position: Position): Position {
    return {
      x: this.camera.pxToMeter(position.x) + this.camera.position.x,
      y: this.camera.pxToMeter(position.y) + this.camera.position.y,
    };
  }
}
