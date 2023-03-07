import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FramesSceneComponent } from "./frames-scene.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgLetModule } from "ng-let";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FrameComponent } from "./components/frame/frame.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { ImageFrameBuilder } from "./image-frame.builder";
import { FrameFormComponent } from "./components/frame-form/frame-form.component";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { TextureLoader } from "three";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    FramesSceneComponent,
    FrameComponent,
    FrameFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    NgLetModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  providers: [
    ImageFrameBuilder,
    {
      provide: 'TEXTURE_LOADER',
      useValue: new TextureLoader(),
    },
  ],
  exports: [
    FramesSceneComponent,
  ],
})
export class FramesSceneModule { }
