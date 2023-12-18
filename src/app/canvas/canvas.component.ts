import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Position} from "../common/util/model/position";
import {ObjectStorageService} from "./object-storage.service";
import {Shape, ShapeType} from "../model/shape";
import {Circle} from "../model/circle";
import {ShapeFactoryService} from "./shape-factory.service";
import {MovementService} from "./movement.service";
import {CollisionService} from "./collision.service";
import {GravityService} from "./gravity.service";
import {AirResistanceService} from "./air-resistance.service";

const CONTEXT = '2d';
export const CANVAS_PROPERTY = {
  width: 1000,
  height: 700,
}
export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;
export const SCALE = 10; // 1 метр = 10 пикселей

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  private canvasContext: CanvasRenderingContext2D;

  private boundingCanvasRect: DOMRect;

  readonly canvasProperty = CANVAS_PROPERTY;

  constructor(
    private objectStorageService: ObjectStorageService,
    private shapeFactoryService: ShapeFactoryService,
    private movementService: MovementService,
    private collisionService: CollisionService,
    private gravityService: GravityService,
    private airResistanceService: AirResistanceService,
  ) {
  }

  ngAfterViewInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext(CONTEXT);
    this.boundingCanvasRect = this.canvas.nativeElement.getBoundingClientRect();

    setInterval(
      this.update.bind(this),
      FRAME_TIME
    );

    setInterval(
      () => {
        this.objectStorageService.removeAll();
      },
      60000
    );

    this.draw();
  }

  @HostListener('window:mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.objectStorageService.add(
      this.shapeFactoryService.create(
        ShapeType.circle,
        {
          x: event.clientX - this.boundingCanvasRect.left,
          y: event.clientY - this.boundingCanvasRect.top,
        },
        {
          radius: 15,
        }
      )
    );
  }

  update(): void {
    this.clear();
    // this.gravityService.handleGravity();
    this.airResistanceService.updateVelocities();
    this.collisionService.handleCollisionWithBorders();
    this.movementService.updatePositions();
    this.draw();
  }

  private draw(): void {
    this.objectStorageService.getAll()
      .forEach(this.drawShape.bind(this));
  }

  private drawShape(shape: Shape): void {
    if (shape.type === ShapeType.circle) {
      this.drawCircle(shape as Circle);
    }
  }

  private drawCircle(circle: Circle): void {
    if (!this.isValidPosition(circle.position)) {
      return;
    }

    this.canvasContext.beginPath();
    this.canvasContext.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI, true);
    this.canvasContext.stroke();
  }

  private clear(): void {
    this.canvasContext.clearRect(0, 0, this.canvasProperty.width, this.canvasProperty.height);
  }

  private isValidPosition(position: Position): boolean {
    return position.x >= 0
      && position.y >= 0
      && position.x <= this.canvasProperty.width
      && position.y <= this.canvasProperty.height;
  }
}
