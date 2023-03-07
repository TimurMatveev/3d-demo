import { Inject, Injectable } from "@angular/core";
import { ImageFrame } from "../../frame.types";
import { FramesSceneThreeService } from "../../frames-scene-three.service";
import {
  DoubleSide,
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Material,
  PlaneGeometry,
  TextureLoader,
  Texture, FrontSide, MeshLambertMaterial,
} from "three";
import { BehaviorSubject } from "rxjs";
import { createImageFrameBorderGeometry, createImageFrameGeometry } from "../../image-frame.geometry";

@Injectable()
export class FrameThree {
  public readonly loaded$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private group: Group = new Group();

  private frame: Mesh = new Mesh();
  private border: Mesh = new Mesh();
  private image: Mesh = new Mesh();

  constructor(
    private threeSceneService: FramesSceneThreeService,
    @Inject('TEXTURE_LOADER') private textureLoader: TextureLoader,
  ) {
  }

  public init(): void {
    this.group.add(
      this.frame,
      this.border,
      this.image,
    );

    this.frame.castShadow = true;
    this.threeSceneService.layer1.add(this.group);
  }

  public destroy(): void {
    this.threeSceneService.layer1.remove(this.group);
    this.group.remove();
  }

  public update(previous: ImageFrame | null, next: ImageFrame): void {
    if (!previous) {
      this.loadImageTexture(next.image.url);
    }

    if (
      previous?.width !== next.width ||
      previous.depth !== next.depth ||
      previous.borderWidth !== next.borderWidth ||
      previous.frameWidth !== next.frameWidth
    ) {
      this.updateGeometry(next);
    }

    if (previous?.color.frame !== next.color.frame) {
      this.updateFrameMaterial(next);
    }

    if (previous?.color.border !== next.color.border) {
      this.updateBorderMaterial(next);
    }

    if (previous?.color.border !== next.color.border) {
      this.updateBorderMaterial(next);
    }

    this.group.position.x = next.translate.x;
    this.group.position.y = next.translate.y;
    this.group.position.z = next.translate.z;
    this.group.rotation.x = next.rotate.x;
    this.group.rotation.y = next.rotate.y;
    this.group.rotation.z = next.rotate.z;
    this.group.scale.x = next.scale.x;
    this.group.scale.y = next.scale.y;
    this.group.scale.z = next.scale.z;
  }

  private updateGeometry(next: ImageFrame): void {
    const aspectRation = next.image.width / next.image.height;
    const width = next.width;
    const height = next.width / aspectRation;
    const borderDelta = 2 * next.borderWidth;
    const frameDelta = 2 * next.frameWidth;

    this.frame.geometry.dispose();
    this.frame.geometry = createImageFrameGeometry(
      width + borderDelta + frameDelta,
      height + borderDelta + frameDelta,
      next.depth,
      next.frameWidth,
    );

    this.border.geometry.dispose();
    this.border.geometry = createImageFrameBorderGeometry(
      width + borderDelta,
      height + borderDelta,
      next.depth,
      next.borderWidth,
    );

    this.image.geometry.dispose();
    this.image.geometry = new PlaneGeometry(
      width,
      height,
    );
    this.image.position.z = next.depth / 2;
  }

  private updateFrameMaterial(next: ImageFrame): void {
    (this.frame.material as Material).dispose();
    this.frame.material = new MeshLambertMaterial({ color: next.color.frame });
  }

  private updateBorderMaterial(next: ImageFrame): void {
    (this.border.material as Material).dispose();
    this.border.material = new MeshLambertMaterial({ color: next.color.border });
  }

  private async loadImageTexture(url: string): Promise<void> {
    const texture: Texture = await this.textureLoader.loadAsync(url);
    this.loaded$.next(1);

    (this.image.material as Material).dispose();
    this.image.material = new MeshLambertMaterial({ map: texture });
  }
}
