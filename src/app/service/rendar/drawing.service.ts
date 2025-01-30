import {Injectable} from "@angular/core";
import {CAMERA_PROPERTY} from "./camera.service";
import {Vector2} from "../../common/util/model/vector2";
import {toVector} from "../../common/util/vector.util";

export const FULL_CIRCLE = 2 * Math.PI;

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  private canvasContext: CanvasRenderingContext2D;

  init(canvasContext: CanvasRenderingContext2D): void {
    this.canvasContext = canvasContext;
  }

  clear(): void {
    this.canvasContext.clearRect(0, 0, CAMERA_PROPERTY.width, CAMERA_PROPERTY.height);
  }

  drawPolygon(position: Vector2, points: Vector2[]): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(position.x, position.y);
    points.forEach((point: Vector2): void  => {
      this.canvasContext.lineTo(point.x, point.y);
    });
    this.canvasContext.lineTo(position.x, position.y);
    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  drawCircle(position: Vector2, radius: number, rotation: number): void {
    this.canvasContext.beginPath();
    this.canvasContext.arc(
      position.x,
      position.y,
      radius,
      0,
      FULL_CIRCLE,
      true
    );
    this.canvasContext.moveTo(position.x, position.y);
    this.canvasContext.lineTo(
      position.x + Math.cos(rotation) * radius,
      position.y + Math.sin(rotation) * radius,
    );
    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  draw(position: Vector2, background: HTMLCanvasElement): void {
    this.canvasContext.drawImage(background, position.x, position.y);
  }
}
