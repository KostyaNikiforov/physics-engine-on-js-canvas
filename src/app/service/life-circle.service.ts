import {inject, Injectable} from "@angular/core";
import {ObjectRenderingService} from "./rendar/object-rendering.service";
import {MovementService} from "./movement/movement.service";
import {CollisionDetectionService} from "./collision/collision-detection.service";
import {INITIAL_TIME_SPEED, ToolBarService} from "../canvas-page/tool-bar/tool-bar.service";
import {ObjectStorageService} from "./object-storage.service";
import {debounceTime, Observable, takeUntil, tap} from "rxjs";
import {ForcesService} from "./forces/forces.service";
import {Shape} from "../model/entity/shape";
import {ContactResolvingService} from "./collision/contact-resolving.service";

const MILLIS_IN_SECOND: number = 1000;
const TIME_SPEED_CHANGE_DELAY: number = 500;

@Injectable({ providedIn: 'root' })
export class LifeCircleService {
  private readonly forcesService: ForcesService = inject(ForcesService);
  private readonly contactResolvingService: ContactResolvingService = inject(ContactResolvingService);

  private static readonly fps: number = 60;

  private readonly defaultTimeFrame: number = MILLIS_IN_SECOND / LifeCircleService.fps;
  private timeFrame: number = this.defaultTimeFrame;

  private static _timeStepPerFrame: number = 1 / LifeCircleService.fps;

  private physicalLoopRefreshIntervalId: any;

  constructor(
    private toolBarService: ToolBarService,
    private movementService: MovementService,
    private collisionService: CollisionDetectionService,
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
    this.subscribeToFrameSpeedChanges(destroy);
  }

  private startRenderLoop(): void {
    setInterval(
      this.renderingService.render.bind(this.renderingService),
      this.defaultTimeFrame,
    );
  }

  private startPhysicalLoop(timeSpeed: number): void {
    this.timeFrame = this.defaultTimeFrame / timeSpeed;

    this.physicalLoopRefreshIntervalId = setInterval(
      this.applyForcesAndMove.bind(this),
      this.timeFrame,
    );
  }

  private stopPhysicalLoop(): void {
    clearInterval(this.physicalLoopRefreshIntervalId);
  }

  private applyForcesAndMove(): void {
    if (this.objectStorageService.isEmpty()) {
      return;
    }

    const allShapes: Shape[] = this.objectStorageService.getAll();

    this.forcesService.apply(allShapes);

    this.collisionService.apply(allShapes);

    this.movementService.move(allShapes);

    this.contactResolvingService.resolve(allShapes);
  }

  private subscribeToTimeSpeedChanges(destroy: Observable<boolean>): void {
    this.toolBarService.timeSpeedChanged$.pipe(
      takeUntil(destroy),
      debounceTime(TIME_SPEED_CHANGE_DELAY),
      tap((timeSpeed: number): void => {
        LifeCircleService._timeStepPerFrame = 1 / LifeCircleService.fps * timeSpeed;
      }),
    ).subscribe();
  }

  private subscribeToFrameSpeedChanges(destroy: Observable<boolean>): void {
    this.toolBarService.frameSpeedChanged$.pipe(
      takeUntil(destroy),
      debounceTime(TIME_SPEED_CHANGE_DELAY),
      tap((): void => {
        if (this.physicalLoopRefreshIntervalId) this.stopPhysicalLoop()
      }),
      tap(this.startPhysicalLoop.bind(this)),
    ).subscribe();
  }
}
