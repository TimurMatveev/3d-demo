import { Injectable } from "@angular/core";
import { ImageFrame } from "./frame.types";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable()
export class ImageFrameBuilder {
  private static id: number = 1;

  constructor(
    private domSanitizer: DomSanitizer,
  ) {
  }

  public async createImageFrameFromFile(file: File): Promise<ImageFrame> {
    return this.createImageFrameFromUrl(URL.createObjectURL(file), file.name);
  }

  public async createImageFrameFromUrl(url: string, name: string): Promise<ImageFrame> {
    const image = new Image();
    image.src = url;

    return new Promise(resolve => {
      image.onload = () => {
        resolve(this.createDefaultImageFrame(url, name, image.width, image.height));
        image.remove();
      };
    });
  }

  public createDefaultImageFrame(url:string, name: string, width: number, height: number): ImageFrame {
    return {
      id: ImageFrameBuilder.id++,
      name,
      image: {
        url,
        safeUrl: this.domSanitizer.bypassSecurityTrustUrl(url),
        width,
        height,
      },
      width: 10,
      depth: 1,
      borderWidth: 0.5,
      frameWidth: 0.5,
      translate: {
        x: 0,
        y: 0,
        z: 0,
      },
      rotate: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      color: {
        frame: '#ffffff',
        border: '#000000',
      },
    };
  }
}
