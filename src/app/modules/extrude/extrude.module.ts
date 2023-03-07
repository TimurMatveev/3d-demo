import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonModule } from "@angular/material/button";

import { ExtrudeComponent } from "./extrude.component";

@NgModule({
  declarations: [
    ExtrudeComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatProgressBarModule,
    MatSliderModule,
    MatButtonModule
  ],
  providers: [],
  exports: [
    ExtrudeComponent
  ]
})
export class ExtrudeModule { }
