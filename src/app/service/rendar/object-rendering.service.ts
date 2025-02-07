import {inject, Injectable} from "@angular/core";
import {WORLD_PROPERTY} from "../../canvas-page/canvas-page.component";
import {CameraService} from "./camera.service";
import {DrawingService} from "./drawing.service";
import {ObjectStorageService} from "../object-storage.service";
import {Shape, ShapeType} from "../../model/entities/shape";
import {Circle} from "../../model/entities/circle";
import {getFilledBackgroundPicture} from "../../common/drawable/world-background";
import {Vector2} from "../../common/util/model/vector2";
import {AppCamera} from "./app-camera";
import {Square} from "../../model/entities/square";

type AdditionalDrawingFunc = (drawingService: DrawingService, toX: (value: number) => number, toY: (value: number) => number) => void

@Injectable({ providedIn: 'root' })
export class ObjectRenderingService {
  private camera: AppCamera = inject(AppCamera);

  private filledBackgroundPicture!: HTMLCanvasElement;
  private additionalDrawings: AdditionalDrawingFunc[] = [];

  constructor(
    private cameraService: CameraService,
    private drawingService: DrawingService,
    private objectStorageService: ObjectStorageService,
  ) {
  }

  render(): void {
    this.drawingService.clear();

    this.drawBackgroundPicture(
      this.getBackgroundPicture(),
      { x: this.toX(0), y: this.toY(0) },
      //{ x: this.camera.meterToPx(WORLD_PROPERTY.width), y: this.camera.meterToPx(WORLD_PROPERTY.height) },
    );

    this.objectStorageService.getAll()
      .forEach(this.drawShape.bind(this));

    if (this.additionalDrawings) {
      this.additionalDrawings.forEach((drawing) => drawing(this.drawingService, this.toX.bind(this), this.toY.bind(this)));
      this.additionalDrawings = [];
    }
  }

  private drawShape(shape: Shape): void {
    switch (shape.type) {
      case ShapeType.circle:
        this.drawCircle(shape as Circle);
        break;
      case ShapeType.square:
        this.drawSquare(shape as Square);
        break;
      default:
        throw new Error(`Unknown shape type: ${shape.type}`);
    }
  }

  private drawPicture(backgroundPicture: HTMLCanvasElement, startPosition: Vector2, endPosition: Vector2): void {
    if (this.isPictureOutOfCameraView(startPosition, endPosition)) {
      return;
    }

    this.drawingService.drawPicture(
      backgroundPicture,
      startPosition,
      endPosition,
    );
  }

  private drawBackgroundPicture(backgroundPicture: HTMLCanvasElement, startPosition: Vector2): void {
    this.drawingService.drawBackgroundPicture(
      backgroundPicture,
      startPosition,
    );
  }

  private drawCircle(circle: Circle): void {
    if (this.isCircleOutOfCameraView(circle)) {
      return;
    }

    this.drawingService.drawCircle(
      {
        x: this.toX(circle.centerPosition.x),
        y: this.toY(circle.centerPosition.y),
      },
      this.camera.meterToPx(circle.radius),
      circle.rotation,
      circle.color,
    );
  }

  private drawSquare(square: Square): void {
    if (this.isSquareOutOfCameraView(square)) {
      return;
    }

    this.drawingService.drawSquare(
      square.points.map((point: Vector2): Vector2 => ({ x: this.toX(point.x), y: this.toY(point.y) })),
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
        this.camera.meterToPx(WORLD_PROPERTY.width),
        this.camera.meterToPx(WORLD_PROPERTY.height),
        getCellSize(this.camera.meterToPx(1), this.camera.scale),
      );
    }

    return this.filledBackgroundPicture;
  }


  private isCircleOutOfCameraView(circle: Circle): boolean {
    return circle.centerPosition.x > this.camera.position.x + this.camera.width + circle.radius
      || circle.centerPosition.x < this.camera.position.x - this.camera.width - circle.radius
      || circle.centerPosition.y > this.camera.position.y + this.camera.height + circle.radius
      || circle.centerPosition.y < this.camera.position.y - this.camera.height - circle.radius;
  }

  private isSquareOutOfCameraView(square: Square): boolean {
    return square.centerPosition.x > this.camera.position.x + this.camera.width + square.size
      || square.centerPosition.x < this.camera.position.x - this.camera.width - square.size
      || square.centerPosition.y > this.camera.position.y + this.camera.height + square.size
      || square.centerPosition.y < this.camera.position.y - this.camera.height - square.size;
  }

  private isPictureOutOfCameraView(startPosition: Vector2, endPosition: Vector2): boolean {
    return startPosition.x > this.camera.position.x + this.camera.width + endPosition.x
      || startPosition.x < this.camera.position.x - this.camera.width - endPosition.x
      || startPosition.y > this.camera.position.y + this.camera.height + endPosition.y
      || startPosition.y < this.camera.position.y - this.camera.height - endPosition.y;
  }

  draw(drawing: (drawingService: DrawingService, toX: (value: number) => number, toY: (value: number) => number) => void) {
    this.additionalDrawings.push(drawing);
  }
}

function getCellSize(cellSize: number, scale: number): number {
  if (scale > 140) {
    return cellSize / 10;
  } else if (scale > 70) {
    return cellSize / 5;
  } else if (scale > 35) {
    return cellSize / 2;
  } else if (scale > 10) {
    return cellSize;
  } else if (scale > 7) {
    return cellSize * 2;
  } else {
    return cellSize * 5;
  }
}
