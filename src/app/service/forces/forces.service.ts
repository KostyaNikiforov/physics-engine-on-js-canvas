import {inject, Injectable} from "@angular/core";
import {GravityService} from "./gravity.service";
import {AirResistanceService} from "./air-resistance.service";
import {ToolBarService} from "../../canvas-page/tool-bar/tool-bar.service";
import {Shape} from "../../model/entity";
import {ForceApplyingService} from "./force-applying.service";

@Injectable({ providedIn: 'root' })
export class ForcesService {
  private readonly gravityService: GravityService = inject(GravityService);
  private readonly airResistanceService: AirResistanceService = inject(AirResistanceService);
  private readonly forceApplyingService: ForceApplyingService = inject(ForceApplyingService);

  private readonly toolBarService: ToolBarService = inject(ToolBarService);

  apply(shapes: Shape[]): void {
    this.clearAllForces(shapes);

    if (this.toolBarService.landGravityEnabled) {
      this.gravityService.applyLangGravity(shapes);
    }

    if (this.toolBarService.airResistanceEnabled) {
      this.airResistanceService.apply(shapes);
    }

    if (this.toolBarService.gravityEnabled) {
      this.gravityService.apply(shapes)
    }

    this.forceApplyingService.apply(shapes);
  }

  clearAllForces(shapes: Shape[]): void {
    shapes.forEach(
      (shape: Shape): void => {
        shape.clearAllForce();
      },
    );
  }
}
