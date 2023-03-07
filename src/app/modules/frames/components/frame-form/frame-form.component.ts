import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageFrame } from "../../frame.types";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { asyncScheduler, throttleTime } from "rxjs";

type VectorForm = FormGroup<{
  x: FormControl<number>,
  y: FormControl<number>,
  z: FormControl<number>,
}>;

type ImageFrameForm = FormGroup<{
  width: FormControl<number>;
  depth: FormControl<number>;
  frameWidth: FormControl<number>;
  borderWidth: FormControl<number>;
  translate: VectorForm;
  rotate: VectorForm;
  scale: VectorForm;
  color: FormGroup<{
    frame: FormControl<string>;
    border: FormControl<string>;
  }>,
}>;

@UntilDestroy()
@Component({
  selector: 'frame-form[frame]',
  templateUrl: './frame-form.component.html',
  styleUrls: ['./frame-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameFormComponent implements OnInit {
  @Input() public frame!: ImageFrame;

  @Output() public updated: EventEmitter<ImageFrame> = new EventEmitter<ImageFrame>();

  public readonly imageFrameForm: ImageFrameForm = new FormGroup({
    width: new FormControl<number>(0, {nonNullable: true}),
    depth: new FormControl<number>(0, {nonNullable: true}),
    frameWidth: new FormControl<number>(0, {nonNullable: true}),
    borderWidth: new FormControl<number>(0, {nonNullable: true}),
    translate: new FormGroup({
      x: new FormControl<number>(0, {nonNullable: true}),
      y: new FormControl<number>(0, {nonNullable: true}),
      z: new FormControl<number>(0, {nonNullable: true}),
    }),
    rotate: new FormGroup({
      x: new FormControl<number>(0, {nonNullable: true}),
      y: new FormControl<number>(0, {nonNullable: true}),
      z: new FormControl<number>(0, {nonNullable: true}),
    }),
    scale: new FormGroup({
      x: new FormControl<number>(0, {nonNullable: true}),
      y: new FormControl<number>(0, {nonNullable: true}),
      z: new FormControl<number>(0, {nonNullable: true}),
    }),
    color: new FormGroup({
      frame: new FormControl<string>('', {nonNullable: true}),
      border: new FormControl<string>('', {nonNullable: true}),
    }),
  });

  public ngOnInit(): void {
    this.imageFrameForm.patchValue(this.frame);

    this.imageFrameForm.valueChanges
      .pipe(
        throttleTime(100, asyncScheduler, { trailing: true }),
        untilDestroyed(this),
      )
      .subscribe((value) => this.updated.emit({
        ...this.frame,
        ...this.imageFrameForm.getRawValue(),
      }));
  }
}
