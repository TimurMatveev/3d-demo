import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
  SimpleChanges,
} from '@angular/core';
import { FrameThree } from "./frame.three";
import { ImageFrame } from "../../frame.types";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'image-frame[imageFrame]',
  template: '',
  providers: [FrameThree],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public imageFrame!: ImageFrame;

  @Output() public loadProgress: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private frameThree: FrameThree,
  ) {
  }

  ngOnInit(): void {
    this.frameThree.init();

    this.frameThree.loaded$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(progress => this.loadProgress.emit(progress));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.frameThree.update(changes['imageFrame'].previousValue || null, changes['imageFrame'].currentValue);
  }

  ngOnDestroy(): void {
    this.frameThree.destroy();
  }
}
