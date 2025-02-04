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

export const WORLD_PROPERTY = {
  width: 100,
  height: 50,
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
  ) {
  }

  ngAfterViewInit(): void {
    this.canvas.init(this.canvasElement.nativeElement);
    this.camera.bindCanvas(this.canvasElement.nativeElement);
    this.cameraService.changes$.pipe(takeUntil(this.destroySubject)).subscribe();
    this.cameraService.subscribeKeyboardEvent(this.destroySubject);
    this.cameraService.centralizeCamera();
    this.shapeCreationService.handleCreationActionOnCanvas(this.canvasElement.nativeElement).subscribe();

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

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
