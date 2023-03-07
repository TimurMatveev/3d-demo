import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy, TrackByFunction,
  ViewChild
} from '@angular/core';
import { FramesSceneThreeService } from "./frames-scene-three.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay } from "rxjs";
import { ImageFrame } from "./frame.types";
import { ImageFrameBuilder } from "./image-frame.builder";
import { NATURE_FRAMES } from "./frames.contants";

@Component({
  selector: 'frames-scene',
  templateUrl: './frames-scene.component.html',
  styleUrls: ['./frames-scene.component.scss'],
  providers: [FramesSceneThreeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FramesSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewport') private elementRef!: ElementRef<HTMLDivElement>;

  public readonly mobileMode$: Observable<boolean> = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
  ]).pipe(
    map((match) => match.matches),
    distinctUntilChanged(),
    shareReplay(1),
  );

  public readonly trackByImageFrame: TrackByFunction<ImageFrame> = (i: number, v: ImageFrame) => v.id;

  public readonly imageFrames$: BehaviorSubject<ImageFrame[]> = new BehaviorSubject<ImageFrame[]>(NATURE_FRAMES);

  public totalProgress: number = 0;

  private readonly loadMap: Map<number, number> = new Map();

  constructor(
    private threeService: FramesSceneThreeService,
    private breakpointObserver: BreakpointObserver,
    private imageFrameBuilder: ImageFrameBuilder,
  ) {
  }

  ngAfterViewInit(): void {
    this.threeService.init(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.threeService.destroy();
  }

  async onFilesChanged(files: FileList | null): Promise<void> {
    if (!files) {
      return;
    }

    const imageFrames: ImageFrame[] = await Promise.all(
      Array.from(files).map((file: File) => this.imageFrameBuilder.createImageFrameFromFile(file)),
    );

    this.imageFrames$.next([
      ...this.imageFrames$.value,
      ...imageFrames,
    ]);

    imageFrames.forEach(({ id }) => this.loadMap.set(id, 0));
    this.updateTotalProgress();
  }

  updateImageFrame(index: number, updatedFrame: ImageFrame | null): void {
    if (!updatedFrame) {
      this.loadMap.delete(this.imageFrames$.value.at(index)!.id);
      this.updateTotalProgress();
    }

    this.imageFrames$.next([
      ...this.imageFrames$.value.slice(0, index),
      ...(updatedFrame ? [updatedFrame] : []),
      ...this.imageFrames$.value.slice(index + 1),
    ]);
  }

  updateLoadProgress(frameId: number, progress: number): void {
    this.loadMap.set(frameId, progress);
    this.updateTotalProgress();
  }

  private updateTotalProgress(): void {
    this.totalProgress =
      [...this.loadMap.values()].reduce((total, progress) => total + progress) / this.loadMap.size;
  }
}
