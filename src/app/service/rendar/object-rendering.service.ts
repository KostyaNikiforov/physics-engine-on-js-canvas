import {inject, Injectable, OnInit} from "@angular/core";
import {WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {CameraService} from "./camera.service";
import {DrawingService} from "./drawing.service";
import {ObjectStorageService} from "../world/object-storage.service";
import {Shape, ShapeType} from "../../model/shape";
import {Circle} from "../../model/circle";
import {getFilledBackgroundPicture} from "../../common/drawable/world-background";
import {Polygon} from "../../model/polygon";
import {Vector2} from "../../common/util/model/vector2";
import {AppCamera, Z_STEP_SIZE} from "./app-camera";

@Injectable({ providedIn: 'root' })
export class ObjectRenderingService {
  private camera: AppCamera = inject(AppCamera);

  private filledBackgroundPicture!: HTMLCanvasElement;

  constructor(
    private cameraService: CameraService,
    private drawingService: DrawingService,
    private objectStorageService: ObjectStorageService,
  ) {
  }

  render(): void {
    this.drawingService.clear();

    this.drawingService.drawPicture(
      { x: this.toX(0), y: this.toY(0) },
      this.getBackgroundPicture(),
      this.toPx(WORLD_PROPERTY.width),
      this.toPx(WORLD_PROPERTY.height),
    );

    this.objectStorageService.getAll()
      .forEach(this.drawShape.bind(this));
  }

  private drawShape(shape: Shape): void {
    switch (shape.type) {
      case ShapeType.circle:
        this.drawCircle(shape as Circle);
        break;
      case ShapeType.polygon:
        this.drawPolygon(shape as Polygon);
        break;
      default:
        throw new Error(`Unknown shape type: ${shape.type}`);
    }
  }

  private drawPolygon(polygon: Polygon): void {
    this.drawingService.drawPolygon(
      {
        x: this.toX(polygon.position.x),
        y: this.toY(polygon.position.y),
      },
      polygon.points.map(
        (point: Vector2) => ({
          x: this.toX(point.x),
          y: this.toY(point.y),
        })
      ),
    );
  }

  private drawCircle(circle: Circle): void {
    this.drawingService.drawCircle(
      {
        x: this.toX(circle.position.x),
        y: this.toY(circle.position.y),
      },
      this.toPx(circle.radius),
      circle.rotation,
      circle.color,
    );
  }

  private toX(value: number): number {
    return this.camera.meterToPx(
      value - this.cameraService.camera.position.x
    );
  }

  private toY(value: number): number {
    return this.camera.meterToPx(
      value - this.cameraService.camera.position.y
    );
  }

  private getBackgroundPicture(): HTMLCanvasElement {
    if (this.camera.isZChanged() || !this.filledBackgroundPicture) {
      this.filledBackgroundPicture = getFilledBackgroundPicture(
        this.toPx(WORLD_PROPERTY.width),
        this.toPx(WORLD_PROPERTY.height),
        this.toPx(1),
        this.camera.scale,
      );
    }

    return this.filledBackgroundPicture;
  }

  private toPx(value: number): number {
    return this.camera.meterToPx(value);
  }
}
