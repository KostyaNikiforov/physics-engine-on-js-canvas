import {inject, Injectable} from "@angular/core";
import {Vector2} from "../../common/util/model/vector2";
import {AppCamera} from "./app-camera";
import {AppCanvas} from "./app-canvas";
import {Circle} from "../../model/entities/circle";

export const FULL_CIRCLE = 2 * Math.PI;

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  private camera: AppCamera = inject(AppCamera);
  private canvas: AppCanvas = inject(AppCanvas);

  clear(): void {
    this.canvas.context.clearRect(0, 0, this.camera.widthPx, this.camera.heightPx);
  }

  drawPolygon(position: Vector2, points: Vector2[]): void {
    this.canvas.context.beginPath();
    this.canvas.context.moveTo(position.x, position.y);
    points.forEach((point: Vector2): void  => {
      this.canvas.context.lineTo(point.x, point.y);
    });
    this.canvas.context.lineTo(position.x, position.y);
    this.canvas.context.stroke();
    this.canvas.context.closePath();
  }

  drawSquare(points: Vector2[], color?: string): void {
    this.canvas.context.beginPath();
    this.canvas.context.moveTo(points[0].x, points[0].y);

    for (let i: number = 1; i < points.length; i++) {
      this.canvas.context.lineTo(points[i].x, points[i].y);
    }

    this.canvas.context.lineTo(points[0].x, points[0].y);

    this.canvas.context.lineWidth = 1;
    this.canvas.context.strokeStyle = color || 'black';
    this.canvas.context.stroke();
    this.canvas.context.closePath();
  }

  drawCircle(position: Vector2, radius: number, rotation: number, color?: string): void {
    this.canvas.context.beginPath();
    this.canvas.context.arc(
      position.x,
      position.y,
      radius,
      0,
      FULL_CIRCLE,
      true
    );
    //this.canvas.context.moveTo(position.x, position.y);
    /*this.canvas.context.lineTo(
      position.x + Math.cos(rotation) * radius,
      position.y + Math.sin(rotation) * radius,
    );*/
    this.canvas.context.lineWidth = 1;
    // this.canvas.context.strokeStyle = color || 'black';
    this.canvas.context.stroke();
    this.canvas.context.closePath();
  }

  drawBackgroundPicture(
    background: HTMLCanvasElement,
    startPosition: Vector2,
  ): void {
    this.canvas.context.drawImage(
      background,
      -startPosition.x,
      -startPosition.y,
      this.camera.widthPx,
      this.camera.heightPx,
      0,
      0,
      this.camera.widthPx,
      this.camera.heightPx,
    );
  }

  drawPicture(background: HTMLCanvasElement, startPosition: Vector2, endPosition: Vector2, ): void {
    this.canvas.context.drawImage(
      background,
      startPosition.x,
      startPosition.y,
      endPosition.x,
      endPosition.y
    );
  }
}
