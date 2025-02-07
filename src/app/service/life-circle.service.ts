import {inject, Injectable} from "@angular/core";
import {ObjectRenderingService} from "./rendar/object-rendering.service";
import {MovementService} from "./movement/movement.service";
import {CollisionService} from "./collision/collision.service";
import {INITIAL_TIME_SPEED, ToolBarService} from "../canvas-page/tool-bar/tool-bar.service";
import {ObjectStorageService} from "./object-storage.service";
import {debounceTime, Observable, takeUntil, tap} from "rxjs";
import {ForcesService} from "./forces/forces.service";
import {Shape} from "../model/shape";

const MILLIS_IN_SECOND: number = 1000;
const TIME_SPEED_CHANGE_DELAY: number = 500;

@Injectable({ providedIn: 'root' })
export class LifeCircleService {
  private readonly forcesService: ForcesService = inject(ForcesService);

  private static readonly fps: number = 60;
  private static readonly _timeStepPerFrame: number = 1 / LifeCircleService.fps;

  private readonly _timeFrame: number = MILLIS_IN_SECOND / LifeCircleService.fps;

  private physicalLoopRefreshIntervalId: any;

  constructor(
    private toolBarService: ToolBarService,
    private movementService: MovementService,
    private collisionService: CollisionService,
    private renderingService: ObjectRenderingService,
    private objectStorageService: ObjectStorageService,
  ) {
  }

  static get timeStepPerFrame(): number {
    return this._timeStepPerFrame;
  }

  run(destroy: Observable<boolean>): void {
    this.startPhysicalLoop(INITIAL_TIME_SPEED);
    this.startRenderLoop();

    this.subscribeToTimeSpeedChanges(destroy);
  }

  private stopPhysicalLoop(): void {
    clearInterval(this.physicalLoopRefreshIntervalId);
  }

  private startPhysicalLoop(timeSpeed: number): void {
    this.physicalLoopRefreshIntervalId = setInterval(
      this.applyForcesAndMove.bind(this),
      this._timeFrame / timeSpeed,
    );
  }

  private startRenderLoop(): void {
    setInterval(
      this.renderingService.render.bind(this.renderingService),
      this._timeFrame,
    );
  }

  private applyForcesAndMove(): void {
    if (this.objectStorageService.isEmpty()) {
      return;
    }

    const allShapes: Shape[] = this.objectStorageService.getAll();

    this.forcesService.apply(allShapes);
    this.collisionService.apply(allShapes);

    this.movementService.move(allShapes);
  }

  private subscribeToTimeSpeedChanges(destroy: Observable<boolean>): void {
    this.toolBarService.timeSpeedChanged$.pipe(
      takeUntil(destroy),
      debounceTime(TIME_SPEED_CHANGE_DELAY),
      tap((): void => {
        if (this.physicalLoopRefreshIntervalId) this.stopPhysicalLoop()
      }),
      tap(this.startPhysicalLoop.bind(this)),
    ).subscribe();
  }
}
