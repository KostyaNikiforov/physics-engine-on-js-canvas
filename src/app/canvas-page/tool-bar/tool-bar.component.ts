import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, inject,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {ObjectStorageService} from "../../service/object-storage.service";
import {FormsModule} from "@angular/forms";
import {ToolBarService} from "./tool-bar.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzMarks, NzSliderModule} from "ng-zorro-antd/slider";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

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
    AsyncPipe,
  ]
})
export class ToolBarComponent {
  readonly directionMarks: NzMarks = {
    0: '0',
    90: '90',
    180: '180',
    270: '270',
    360: '360',
  };
  readonly radiusMarks: NzMarks = {
    1: '0.1',
    50: '5',
    100: '10',
    200: '20',
  }
  readonly speedMarks: NzMarks = {
    1: '1',
    5: '5',
    10: '10',
    20: '20',
    50: '50',
    75: '75',
    100: '100',
  }
  readonly timeSpeedMarks: NzMarks = {
    10: '0.1',
    50: '0.5',
    100: '1',
    150: '1.5',
    200: '2',
    250: '2.5',
    300: '3',
    350: '3.5',
    400: '4',
    450: '4.5',
    500: '5',
  }

  readonly objectsNumber$: Observable<number> = this.objectStorageService.objectsNumber$;

  constructor(
    public toolBarService: ToolBarService,
    private objectStorageService: ObjectStorageService,
  ) {
  }

  removeAll(): void {
    this.objectStorageService.removeAll();
  }

  removeLast(): void {
    this.objectStorageService.removeLast();
  }

  changeRadius($event: number): void {
    this.toolBarService.radius = $event;
  }
}
