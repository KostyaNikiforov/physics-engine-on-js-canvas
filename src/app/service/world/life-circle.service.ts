import {Injectable} from "@angular/core";
import {ObjectRenderingService} from "../rendar/object-rendering.service";
import {MovementService} from "./movement.service";
import {CollisionService} from "../forces/collision.service";
import {GravityService} from "../forces/gravity.service";
import {AirResistanceService} from "../forces/air-resistance.service";
import {ToolBarService} from "../control/tool-bar.service";
import {ObjectStorageService} from "./object-storage.service";
import {ShapeFactoryService} from "../shape-factory.service";
import {ShapeType} from "../../model/shape";

@Injectable({
  providedIn: 'root'
})
export class LifeCircleService {
  static readonly fps = 120;

  static readonly frameTime = 1000 / LifeCircleService.fps

  static readonly timeStepPerFrame: number = 1 / LifeCircleService.fps;

  constructor(
    private toolBarService: ToolBarService,
    private renderingService: ObjectRenderingService,
    private movementService: MovementService,
    private collisionService: CollisionService,
    private gravityService: GravityService,
    private airResistanceService: AirResistanceService,
    private objectStorageService: ObjectStorageService,
  ) {
  }

  run(): void {
    setInterval(
      this.update.bind(this),
      LifeCircleService.frameTime
    );
  }

  private update(): void {
    if (!this.objectStorageService.isEmpty() && !this.toolBarService.paused) {
      this.applyForces();
    }

    this.renderingService.render();
  }

  private applyForces(): void {
    if (this.toolBarService.landGravityEnabled) {
      this.gravityService.applyLangGravity();
    }

    if (this.toolBarService.airResistanceEnabled) {
      this.airResistanceService.apply();
    }

    if (this.toolBarService.gravityEnabled) {
      this.gravityService.apply()
    }

    if (this.toolBarService.collisionEnabled) {
      this.collisionService.handleWithCircles();
    }

    if (this.toolBarService.borderCollisionEnabled) {
      this.collisionService.handleWithBorders();
    }

    this.movementService.move(this.toolBarService.rotationEnabled);
  }
}
