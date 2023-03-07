import { Injectable } from "@angular/core";
import {
  AxesHelper,
  BufferGeometry,
  Color,
  Fog,
  Group,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { Observable } from "rxjs";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ProgressModel } from "../../shared/progress.model";

@Injectable()
export class ExtrudeThreeService {
  public readonly scene = new Scene();
  public readonly camera = new PerspectiveCamera( 75, 1, 0.1, 1000 );
  public readonly renderer = new WebGLRenderer();

  public readonly layer1: Group = new Group();
  public readonly layer2: Group = new Group();

  private resizeObserver: ResizeObserver = new ResizeObserver(
    (entries) => this.resetViewport(entries.at(0)!.contentRect)
  );
  private rafId: number = 0;
  private objLoader: OBJLoader = new OBJLoader();
  private axesHelper: AxesHelper = new AxesHelper( 5 );

  public get showAxes(): boolean {
    return this.scene.children.includes(this.axesHelper);
  }
  public set showAxes(shown: boolean) {
    if (shown) {
      this.scene.add(this.axesHelper);
    } else {
      this.scene.remove(this.axesHelper);
    }
  }

  public init(element: HTMLElement): void {
    this.initScene();
    this.initCamera();

    element.appendChild(this.renderer.domElement);

    this.resizeObserver.observe(element);

    this.showAxes = true;

    this.rerender();
  }

  private initScene(): void {
    this.scene.background = new Color( 0xeeeeee );
    this.scene.fog = new Fog( 0xa0a0a0, 10, 50 );
    this.scene.add(this.layer1);
    this.scene.add(this.layer2);
  }

  private initCamera(): void {
    this.camera.position.set( -10, 10, 10 );

    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set( 0, 0, 0 );
    controls.update();
  }

  public destroy(): void {
    this.rafId && cancelAnimationFrame(this.rafId);
  }

  public loadGeometry(path: string): Observable<ProgressModel<BufferGeometry>> {
    return new Observable<ProgressModel<BufferGeometry>>(subscriber => {
      this.objLoader.load(
        path,
        (object: Group) => {
          // @ts-ignore
          const result = (object.children.at(0)?.geometry as BufferGeometry).clone();
          subscriber.next({ result, complete: true });
          subscriber.complete();
        },
        (event: ProgressEvent) => {
          subscriber.next({
            complete: false,
            total: event.total,
            current: event.loaded,
          });
        },
        (error: ErrorEvent) => {
          subscriber.error(error.message);
        },
      );
    });
  }

  private rerender() {
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(() => this.rerender());
  }

  private resetViewport(rect: DOMRect): void {
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height);
  }
}
