import { SafeUrl } from "@angular/platform-browser";

export type ImageFrame = {
  id: number;
  name: string;
  borderWidth: number;
  frameWidth: number;
  image: {
    url: string;
    safeUrl: SafeUrl,
    width: number;
    height: number;
  },
  width: number;
  depth: number;
  translate: {
    x: number;
    y: number;
    z: number;
  },
  rotate: {
    x: number;
    y: number;
    z: number;
  },
  scale: {
    x: number;
    y: number;
    z: number;
  },
  color: {
    frame: string;
    border: string;
  },
};
