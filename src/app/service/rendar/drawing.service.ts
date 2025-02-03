import {inject, Injectable} from "@angular/core";
import {Vector2} from "../../common/util/model/vector2";
import {AppCamera} from "./app-camera.service";
import {AppCanvas} from "./app-canvas.service";

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

  drawCircle(position: Vector2, radius: number, rotation: number): void {
    this.canvas.context.beginPath();
    this.canvas.context.arc(
      position.x,
      position.y,
      radius,
      0,
      FULL_CIRCLE,
      true
    );
    this.canvas.context.moveTo(position.x, position.y);
    this.canvas.context.lineTo(
      position.x + Math.cos(rotation) * radius,
      position.y + Math.sin(rotation) * radius,
    );
    this.canvas.context.stroke();
    this.canvas.context.closePath();
  }

  draw(position: Vector2, background: HTMLCanvasElement): void {
    this.canvas.context.drawImage(background, position.x, position.y);
  }
}
