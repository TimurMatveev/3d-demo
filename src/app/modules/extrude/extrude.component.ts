import { ChangeDetectionStrategy, Component, ElementRef, isDevMode, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap
} from "rxjs";
import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  WireframeGeometry
} from "three";
import { extractVertexConfigs, extrudeVertices, getFlatVertices, VertexConfig } from "./extrude.helper";
import { ExtrudeThreeService } from "./extrude-three.service";
import { isProgressModelComplete, ProgressModel, ProgressModelComplete } from "../../shared/progress.model";

type ModelSource = {
  name: string;
  path: string;
}

@Component({
  selector: 'extrude-scene',
  templateUrl: './extrude.component.html',
  styleUrls: ['./extrude.component.scss'],
  providers: [ExtrudeThreeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtrudeComponent implements OnInit, OnDestroy {
  @ViewChild('viewport', { static: true }) private elementRef!: ElementRef<HTMLDivElement>;

  public readonly models: ModelSource[] = [
    { name: 'Plane', path: 'assets/plane.obj' },
    { name: 'Cube', path: 'assets/cube.obj' },
    { name: 'Tetrahedron', path: 'assets/tetrahedron.obj' },
    { name: 'Sphere (Low Poly)', path: 'assets/icosphere_lp.obj' },
    { name: 'Sphere (High Poly)', path: 'assets/icosphere_hp.obj' },
    { name: 'Pyramid 4', path: 'assets/piramid4.obj' },
    { name: 'Pyramid 8', path: 'assets/piramid8.obj' },
    { name: 'Torus Simple', path: 'assets/torus_simple.obj' },
    { name: 'Torus (Low Poly)', path: 'assets/torus_lp.obj' },
    { name: 'Torus (High Poly)', path: 'assets/torus_hp.obj' },
    { name: 'UV Sphere', path: 'assets/uv_sphere.obj' },
    { name: 'Monkey Susanna', path: 'assets/monkey.obj' },
  ];

  public readonly selectedModel$: BehaviorSubject<ModelSource> =
    new BehaviorSubject<ModelSource>(this.models.at(0)!);

  public readonly geometry$: Observable<ProgressModel<BufferGeometry>> = this.selectedModel$.pipe(
    tap(() => {
      this.threeService.layer1.clear();
      this.threeService.layer2.clear();
    }),
    switchMap((model: ModelSource) => this.threeService.loadGeometry(isDevMode() ? model.path : `dist/${model.path}`)),
    shareReplay(1),
  );

  public readonly vertexConfig$: Observable<VertexConfig[]> = this.geometry$.pipe(
    filter<ProgressModel<BufferGeometry>, ProgressModelComplete<BufferGeometry>>(isProgressModelComplete),
    map((model: ProgressModelComplete<BufferGeometry>) => extractVertexConfigs(model.result)),
    shareReplay(1),
  );

  public readonly extrudeDistance$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private threeService: ExtrudeThreeService,
  ) {
  }

  ngOnInit(): void {
    this.threeService.init(this.elementRef.nativeElement);

    this.geometry$
      .pipe(
        filter<ProgressModel<BufferGeometry>, ProgressModelComplete<BufferGeometry>>(isProgressModelComplete),
      )
      .subscribe((model) => {
        const material = new MeshBasicMaterial({ color: '#282828', transparent: true, opacity: 0.75 });
        this.threeService.layer1.add(new Mesh(model.result, material));
        const edges = new WireframeGeometry( model.result );
        const line = new LineSegments( edges, new LineBasicMaterial( { color: 0xffffff, linewidth: 0.2 } ) );
        this.threeService.layer1.add( line );
      });

    combineLatest([
      this.vertexConfig$,
      this.extrudeDistance$,
    ]).pipe(
      tap(() => this.threeService.layer2.clear()),
      map(([vertices, distance]) => {
        const position = getFlatVertices(extrudeVertices(vertices, distance));
        return new BufferGeometry().setAttribute('position', new BufferAttribute(position, 3));
      }),
    ).subscribe((geometry: BufferGeometry) => {
      const material = new MeshBasicMaterial({ color: '#731f1f', wireframe: true });
      this.threeService.layer2.add(new Mesh(geometry, material));
    });
  }

  ngOnDestroy(): void {
    this.threeService.destroy();
  }
}
