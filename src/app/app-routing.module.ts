import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CanvasPageComponent} from "./canvas-page/canvas-page.component";

const routes: Routes = [
  {
    path: '',
    component: CanvasPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
