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
import {getVectorMagnitude} from "../common/util/vector.util";
import {getDistanceBetweenPoints} from "../common/position.util";

const CONTEXT = '2d';

const FULL_CIRCLE = 2 * Math.PI;

export const PX_IN_METERS = 50; // 1 метр = 10 пикселей
export const WORLD_PROPERTY = {
  width: 20,
  height: 12,
}
export const CANVAS_PROPERTY = {
  width: WORLD_PROPERTY.width * PX_IN_METERS,
  height: WORLD_PROPERTY.height * PX_IN_METERS,
}
export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;

export function toMeter(px: number): number {
  return px / PX_IN_METERS;
}

export function toPx(meter: number): number {
  return meter * PX_IN_METERS;
}

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

  private focusedShape: Circle;

  isGravityEnabled: boolean = true;

  isAirResistanceEnabled: boolean = true;

  isBorderCollisionEnabled: boolean = true;

  isCollisionEnabled: boolean = true;

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
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.focusedShape) {
      this.setDirectionToMouse(this.focusedShape, this.mouseEventToPosition(event))
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscapeKeyDown(): void {
    this.focusedShape = null;
  }

  @HostListener('window:keydown.arrowup', ['$event'])
  onArrowUpKeyDown(): void {
    if (this.focusedShape) {
      const circle: Circle = this.focusedShape;

      circle.velocity.x += 1;
      circle.velocity.y += 1;
    }
  }

  @HostListener('window:keydown.arrowdown', ['$event'])
  onArrowDownKeyDown(event: KeyboardEvent): void {
    if (this.focusedShape) {
      const circle: Circle = this.focusedShape;

      circle.velocity.x -= 1;
      circle.velocity.y -= 1;
    }
  }

  private setDirectionToMouse(circle: Circle, mousePosition: Position): void {
    const angle: number = Math.atan2(
      mousePosition.y - circle.position.y,
      mousePosition.x - circle.position.x,
    );

    const speed: number = getDistanceBetweenPoints(
      mousePosition,
      circle.position,
    ) * FPS;

    circle.velocity.x = Math.cos(angle) * speed;
    circle.velocity.y = Math.sin(angle) * speed;
  }

  onMouseDown(event: MouseEvent): void {
    if (
      this.objectStorageService.hasShapeOnThisPosition(
        this.mouseEventToPosition(event),
      )
    ) {
      return;
    }

    this.objectStorageService.add(
      this.shapeFactoryService.create(
        ShapeType.circle,
        this.mouseEventToPosition(event),
        {
          radius: Math.random() + 0.3,
          speed: Math.random() * 4 + 1,
          direction: Math.random() * 360,
        }
      )
    );
  }

  update(): void {
    this.clear();
    if (this.isGravityEnabled) {
      this.gravityService.handleGravity();
    }
    if (this.isAirResistanceEnabled) {
      this.airResistanceService.updateVelocities();
    }
    if (this.isBorderCollisionEnabled) {
      this.collisionService.handleCollisionWithBorders();
    }
    if (this.isCollisionEnabled) {
      this.collisionService.handleCollisionWithCircles();
    }
    this.movementService.updatePositions();
    this.draw();
  }

  private draw(): void {
    this.objectStorageService.getAll()
      .forEach(this.drawShape.bind(this));
  }

  private drawShape(shape: Shape): void {
    switch (shape.type) {
      case ShapeType.circle:
        this.drawCircle(shape as Circle);
        break;
      default:
        throw new Error(`Unknown shape type: ${shape.type}`);
    }
  }

  private drawCircle(circle: Circle): void {
    if (!this.isValidPosition(circle.position)) {
      return;
    }

    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = circle.color;
    this.canvasContext.arc(
      toPx(circle.position.x),
      toPx(circle.position.y),
      toPx(circle.radius),
      0,
      FULL_CIRCLE,
      true
    );
    this.canvasContext.fillText(`${circle.mass.toFixed(2)}кг`, toPx(circle.position.x + circle.radius), toPx(circle.position.y - circle.radius))
    this.canvasContext.fillText(`${getVectorMagnitude(circle.velocity).toFixed(2)}m/s`, toPx(circle.position.x + circle.radius), toPx(circle.position.y - circle.radius) + 10)
    this.canvasContext.stroke();
  }

  removeAll(): void {
    this.objectStorageService.removeAll();
  }

  private clear(): void {
    this.canvasContext.clearRect(0, 0, this.canvasProperty.width, this.canvasProperty.height);
  }

  private isValidPosition(position: Position): boolean {
    return position.x >= 0
      && position.y >= 0
      && position.x <= WORLD_PROPERTY.width
      && position.y <= WORLD_PROPERTY.height;
  }

  switchGravity(): void {
    this.isGravityEnabled = !this.isGravityEnabled;
  }

  switchAirResistance(): void {
    this.isAirResistanceEnabled = !this.isAirResistanceEnabled;
  }

  switchBorderCollision(): void {
    this.isBorderCollisionEnabled = !this.isBorderCollisionEnabled;
  }

  switchCollision(): void {
    this.isCollisionEnabled = !this.isCollisionEnabled;
  }

  focusOnShape(event: MouseEvent): void {
    this.focusedShape = this.objectStorageService.getElementByPosition(
      this.mouseEventToPosition(event),
    ) as Circle;
  }

  private mouseEventToPosition(event: MouseEvent): Position {
    return {
      x: toMeter(event.clientX - this.boundingCanvasRect.left),
      y: toMeter(event.clientY - this.boundingCanvasRect.top),
    };
  }

  getNumberOfShapes(): number {
    return this.objectStorageService.getAll().length;
  }
}
