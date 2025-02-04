import {Injectable} from "@angular/core";

const DEFAULT_CONTEXT = '2d';

@Injectable({ providedIn: 'root' })
export class AppCanvas {
  private canvasContext: CanvasRenderingContext2D;

  init(canvasElement: HTMLCanvasElement): void {
    this.canvasContext = canvasElement.getContext(DEFAULT_CONTEXT)
  }

  get context(): CanvasRenderingContext2D {
    return this.canvasContext
  }
}
