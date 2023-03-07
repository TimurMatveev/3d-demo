import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ExtrudeModule } from "./modules/extrude/extrude.module";
import { FramesSceneModule } from "./modules/frames/frames-scene.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // ExtrudeModule,
    FramesSceneModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
