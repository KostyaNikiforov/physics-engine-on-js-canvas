import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ObjectStorageService} from "../service/world/object-storage.service";
import {CAMERA_PROPERTY, CameraService} from "../service/rendar/camera.service";
import {ShapeCreationService} from "../service/shape-creation.service";
import {ShapeFactoryService} from "../service/shape-factory.service";
import {DrawingService} from "../service/rendar/drawing.service";
import {LifeCircleService} from "../service/world/life-circle.service";
import {ToolBarService} from "../service/control/tool-bar.service";
import {ShapeType} from "../model/shape";

export const WORLD_PROPERTY = {
  width: 40,
  height: 20,
}
const CONTEXT = '2d';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  readonly cameraProperty = CAMERA_PROPERTY;

  constructor(
    private objectStorageService: ObjectStorageService,
    private cameraService: CameraService,
    private shapeCreationService: ShapeCreationService,
    private shapeFactoryService: ShapeFactoryService,
    private drawingService: DrawingService,
    private lifeCircleService: LifeCircleService,
    public toolBarService: ToolBarService,
  ) {
  }

  ngAfterViewInit(): void {
    const canvasContext: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(CONTEXT)

    this.cameraService.changes$.subscribe();
    this.shapeCreationService.handleCreationActionOnCanvas(this.canvas.nativeElement).subscribe();
    this.drawingService.init(canvasContext);

    /*this.objectStorageService.add(this.shapeFactoryService.create(
      ShapeType.polygon,
      {
        x: 3,
        y: 3,
      },
      {
        polygons: [
          {
            x: 5,
            y: 3,
          },
          {
            x: 3,
            y: 5,
          },
          {
            x: 1,
            y: 3,
          }
        ]
      }
    ));*/

    this.lifeCircleService.run();
  }


  removeAll(): void {
    this.objectStorageService.removeAll();
  }
}
