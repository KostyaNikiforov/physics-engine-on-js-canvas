import {inject, Injectable} from "@angular/core";
import {MouseClickEventData, MouseEventService} from "./control/mouse-event.service";
import {Observable, takeUntil, tap} from "rxjs";
import {ObjectStorageService} from "./object-storage.service";
import {Shape, ShapeType} from "../model/shape";
import {ShapeFactoryService} from "./shape-factory.service";
import {AppCamera} from "./rendar/app-camera";
import {ToolBarService} from "../canvas-page/tool-bar/tool-bar.service";
import {MathUtil} from "../common/math.util";
import {MaterialType} from "../model/material";
import {Vector2} from "../common/util/model/vector2";

@Injectable({ providedIn: 'root' })
export class ShapeCreationService {
  private readonly mouseEventService: MouseEventService = inject(MouseEventService);
  private readonly objectStorageService: ObjectStorageService = inject(ObjectStorageService);
  private readonly shapeFactoryService: ShapeFactoryService = inject(ShapeFactoryService);
  private toolBarService: ToolBarService = inject(ToolBarService);
  private camera: AppCamera = inject(AppCamera);

  subscribeOnMouseEvents(destroy: Observable<boolean>): void{
    this.mouseEventService.mouseClickEvent$.pipe(
      takeUntil(destroy),
      tap(this.handleClick.bind(this)),
    ).subscribe();
  }

  private handleClick(eventData: MouseClickEventData): void {
    this.createSquare(eventData);
  }

  private createCircle(eventData: MouseClickEventData): void {
    this.objectStorageService.add(
      this.shapeFactoryService.create(
        ShapeType.circle,
        this.mouseEventToPosition(eventData.position),
        {
          radius: this.toolBarService.radius / 10,
          speed: this.toolBarService.speed,
          direction: MathUtil.getVectorFromAngle(this.toolBarService.direction),
        }
      )
    );
  }

  private createSquare(eventData: MouseClickEventData): void {
    const shape: Shape = this.shapeFactoryService.create(
      ShapeType.square,
      this.mouseEventToPosition(eventData.position),
      {
        size: this.toolBarService.radius / 10,
        speed: this.toolBarService.speed,
        direction: MathUtil.getVectorFromAngle(this.toolBarService.direction),
      },
      MaterialType.WOOD
    );

    shape.rotationSpeed = 1;

    this.objectStorageService.add(shape);
  }

  private mouseEventToPosition(position: Vector2): Vector2 {
    return {
      x: this.camera.pxToMeter(position.x) + this.camera.position.x,
      y: this.camera.pxToMeter(position.y) + this.camera.position.y,
    };
  }
}
