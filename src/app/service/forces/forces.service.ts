import {inject, Injectable} from "@angular/core";
import {GravityService} from "./gravity.service";
import {AirResistanceService} from "./air-resistance.service";
import {ToolBarService} from "../../canvas-page/tool-bar/tool-bar.service";
import {Shape} from "../../model/shape";

@Injectable({ providedIn: 'root' })
export class ForcesService {
  private readonly gravityService: GravityService = inject(GravityService);
  private readonly airResistanceService: AirResistanceService = inject(AirResistanceService);

  private readonly toolBarService: ToolBarService = inject(ToolBarService);

  apply(shapes: Shape[]): void {
    if (this.toolBarService.landGravityEnabled) {
      this.gravityService.applyLangGravity(shapes);
    }

    if (this.toolBarService.airResistanceEnabled) {
      this.airResistanceService.apply(shapes);
    }

    if (this.toolBarService.gravityEnabled) {
      this.gravityService.apply(shapes)
    }
  }
}
