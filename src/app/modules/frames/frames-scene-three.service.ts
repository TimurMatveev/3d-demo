import { Injectable } from "@angular/core";
import {
  AmbientLight,
  AxesHelper, BoxGeometry,
  BufferGeometry,
  Color, DirectionalLight, DirectionalLightHelper,
  Fog,
  Group, Mesh, MeshBasicMaterial, MeshLambertMaterial,
  PerspectiveCamera, PlaneGeometry, PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import { Observable } from "rxjs";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ProgressModel } from "../../shared/progress.model";

@Injectable()
export class FramesSceneThreeService {
  public readonly scene = new Scene();
  public readonly camera = new PerspectiveCamera( 75, 1, 0.01, 100000 );
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

    // this.showAxes = true;

    this.rerender();
  }

  private initScene(): void {
    this.renderer.shadowMap.enabled = true;

    this.scene.background = new Color( 0x555555 );
    this.scene.fog = new Fog( 0xa0a0a0, 10, 1000 );
    this.scene.add(this.layer1);
    this.scene.add(this.layer2);

    this.setLight();
  }

  private initCamera(): void {
    this.camera.position.set( -10, 10, 10 );

    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set( 0, 0, 0 );
    controls.update();
  }

  private setLight(): void {
    const ambientLight = new AmbientLight( 0xffffff, 0.2 );

    const pointLightIntensity= 3;
    const pointLight1 = new PointLight( 0xffffff, pointLightIntensity, 100 );
    const pointLight2 = new PointLight( 0xffffff, pointLightIntensity, 100 );
    pointLight1.position.set( 10, 20, 50 );
    pointLight1.castShadow = true;
    pointLight2.position.set( -10, 20, 50 );
    pointLight2.castShadow = true;

    this.scene.add(ambientLight, pointLight1, pointLight2);
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
