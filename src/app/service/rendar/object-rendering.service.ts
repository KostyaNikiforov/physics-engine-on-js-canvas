import {Injectable} from "@angular/core";
import {WORLD_PROPERTY} from "../../canvas-page/canvas.component";
import {CameraService} from "./camera.service";
import {DrawingService} from "./drawing.service";
import {ObjectStorageService} from "../world/object-storage.service";
import {Shape, ShapeType} from "../../model/shape";
import {Circle} from "../../model/circle";
import {getBackground} from "../../drawable/world-background";
import {Polygon} from "../../model/polygon";
import {Vector2} from "../../common/util/model/vector2";

@Injectable({
  providedIn: 'root'
})
export class ObjectRenderingService {
  private readonly background: HTMLCanvasElement = getBackground(
    this.toPx(WORLD_PROPERTY.width),
    this.toPx(WORLD_PROPERTY.height),
    this.toPx(0.5)
  );

  constructor(
    private cameraService: CameraService,
    private drawingService: DrawingService,
    private objectStorageService: ObjectStorageService,
  ) {
  }

  render(): void {
    this.drawingService.clear();

    this.drawingService.draw(
      { x: this.toX(0), y: this.toY(0) },
      this.background
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
      circle.rotation
    );
  }

  private toX(value: number): number {
    return this.cameraService.toPx(
      value - this.cameraService.camera.position.x
    );
  }

  private toY(value: number): number {
    return this.cameraService.toPx(
      value - this.cameraService.camera.position.y
    );
  }

  private toPx(value: number): number {
    return this.cameraService.toPx(value);
  }
}
