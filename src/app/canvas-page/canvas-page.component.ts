import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, inject, OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CameraService} from "../service/rendar/camera.service";
import {ShapeCreationService} from "../service/shape-creation.service";
import {LifeCircleService} from "../service/world/life-circle.service";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {FormsModule} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {AppCamera} from "../service/rendar/app-camera";
import {NgIf} from "@angular/common";
import {AppCanvas} from "../service/rendar/app-canvas";
import {ToolBarComponent} from "./tool-bar/tool-bar.component";
import {Subject, takeUntil} from "rxjs";
import {ShapeType} from "../model/shape";
import {ObjectStorageService} from "../service/world/object-storage.service";
import {ShapeFactoryService} from "../service/shape-factory.service";

export const WORLD_PROPERTY = {
  width: 200,
  height: 100,
}

@Component({
  standalone: true,
  selector: 'app-canvas-page',
  templateUrl: './canvas-page.component.html',
  styleUrls: ['./canvas-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzSwitchComponent,
    FormsModule,
    NzButtonComponent,
    NgIf,
    ToolBarComponent
  ],
  host: {
    class: "app-canvas-page"
  },
})
export class CanvasPageComponent implements AfterViewInit, OnDestroy {
  private readonly destroySubject: Subject<boolean> = new Subject<boolean>();

  private readonly camera: AppCamera = inject(AppCamera);
  private readonly canvas: AppCanvas = inject(AppCanvas);

  @ViewChild('canvas', { static: false }) canvasElement: ElementRef<HTMLCanvasElement>;

  constructor(
    private cameraService: CameraService,
    private lifeCircleService: LifeCircleService,
    private shapeCreationService: ShapeCreationService,
    private objectStorageService: ObjectStorageService,
    private shapeFactoryService: ShapeFactoryService,
  ) {
  }

  ngAfterViewInit(): void {
    this.canvas.init(this.canvasElement.nativeElement);
    this.camera.bindCanvas(this.canvasElement.nativeElement);
    this.cameraService.changes$.pipe(takeUntil(this.destroySubject)).subscribe();
    this.cameraService.subscribeKeyboardEvent(this.destroySubject);
    this.cameraService.moveCameraToBottomCenter();
    this.shapeCreationService.handleCreationActionOnCanvas().subscribe();

    for (let i = 0; i < 1500; i++) {
      this.objectStorageService.add(
        this.shapeFactoryService.create(
          ShapeType.circle,
          {
            x: Math.random() * WORLD_PROPERTY.width,
            y: Math.random() * WORLD_PROPERTY.height,
          },
          {
            radius: 0.1,
            speed: 3,
            direction: {
              x: 0,
              y: 0,
            },
          }
        )
      );
    }

    this.lifeCircleService.run();

    // Random position from
    /*setInterval(() => {
      this.objectStorageService.add(
        this.shapeFactoryService.create(
          ShapeType.circle,
          {
            x: WORLD_PROPERTY.width / 2,
            y: WORLD_PROPERTY.height / 2,
          },
          {
            radius: Math.random() * 3 + 0.2,
            speed: Math.random() * 100 + 1,
            direction: {
              x: 1,
              y: 0,
            },
          }
        )
      );
    }, 100);*/


    /*setInterval(() => {
      this.objectStorageService.add(
        this.shapeFactoryService.create(
          ShapeType.circle,
          {
            x: 0.3,
            y: 0.3,
          },
          {
            radius: 0.2,
            speed: 5,
            direction: {
              x: 1,
              y: 0,
            },
          }
        )
      );
    }, 100);*/

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
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
