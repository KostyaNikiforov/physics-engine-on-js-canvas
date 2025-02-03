import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, inject,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {ObjectStorageService} from "../../service/world/object-storage.service";
import {FormsModule} from "@angular/forms";
import {ToolBarService} from "../../service/control/tool-bar.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzInputDirective} from "ng-zorro-antd/input";
import { NzSliderModule} from "ng-zorro-antd/slider";

@Component({
  standalone: true,
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "app-tool-bar" },
  imports: [
    NzSwitchComponent,
    FormsModule,
    NzButtonComponent,
    NzInputDirective,
    NzSliderModule,
  ]
})
export class ToolBarComponent {
  constructor(
    public toolBarService: ToolBarService,
    private objectStorageService: ObjectStorageService,
  ) {
  }

  removeAll(): void {
    this.objectStorageService.removeAll();
  }

  changeRadius($event: number): void {
    this.toolBarService.radius = $event;
  }
}
