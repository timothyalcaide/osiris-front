import { Component, OnDestroy, OnInit } from '@angular/core'
import { Params } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import { RouterSelectors } from '../../../core/store/states/router.state.selector'
import { BaseMap, CameraPositionType, MapConfig, Picture, PicturePoint } from '../../../shared/models'
import {
  BaseMapState,
  ChangeCameraPosition,
  LoadBaseMap,
  LoadBaseMapWithParams,
  LoadPicturesPointById,
  LoadPicturesPointByLngLat,
  PicturesState,
  SetForeground,
  SetMapConfig,
  SetMinimize,
  ToggleForeground,
  ToggleMinimize,
  UiState,
} from '../store'

export enum QueryParamsFromImajebox {
  bbox = 'bbox',
  image = 'image',
  point = 'point',
  minimize = 'minimize',
  camera = 'camera',
}

AutoUnsubscribe()
@Component({
  selector: 'app-imajbox',
  template: `
    <app-template-one [minimize]="minimize$ | async">
      <!-- Background  -->
      <ng-container background>
        <ng-container *ngIf="!(imageInBig$ | async)">
          <app-mapbox
            *ngIf="baseMap$ | async as map"
            [baselayers]="map.baselayers"
            [config]="map.config"
            [overlays]="map.overlays"
            [point]="(picturesPoint$ | async)?.geom"
            (position)="getNearestPoint($event)"
            (mapConfig)="setMapConfig($event)"
            [direction]="(selectedPicture$ | async)?.direction"
            [mapInBig]="!(imageInBig$ | async)"
            (loaded)="mapIsLoaded = $event"
            [dragend]="dragEnd"
          ></app-mapbox>
          <div class="absolute right-0 top-and-marge" *ngIf="mapIsLoaded">
            <app-drag-and-search (dragEnd)="dragEnd = true"></app-drag-and-search>
          </div>

          <div class="absolute top-0 right m-3">
            <button
              mat-mini-fab
              color="accent"
              [matTooltip]="'Changer de template'"
              matTooltipPosition="before"
              class="relative"
              routerLink="./split"
            >
              <mat-icon>looks_one</mat-icon>
            </button>
          </div>
        </ng-container>
        <ng-container *ngIf="imageInBig$ | async">
          <app-flat-image [picture]="selectedPicture$ | async" [zoom]="true" class="relative"></app-flat-image>
          <div class="absolute bottom-0 right-0 mb-6 mr-2">
            <app-car-compass
              [pictures]="(picturesPoint$ | async)?.pictures"
              [selected]="(selectedPicture$ | async)?.camera"
              (camera)="onChangeCameraPosition($event)"
            ></app-car-compass>
          </div>
          <div class="absolute bottom-0 left-0 m-3">
            <app-image-infos [point]="picturesPoint$ | async" [picture]="selectedPicture$ | async"></app-image-infos>
          </div>
          <div class="absolute top-0 right-0 m-3">
            <button
              mat-mini-fab
              color="accent"
              [matTooltip]="'Changer de template'"
              matTooltipPosition="before"
              class="relative"
              routerLink="./split"
            >
              <mat-icon>looks_one</mat-icon>
            </button>
          </div>

          <app-navigation-perspective
            [picturePoint]="picturesPoint$ | async"
            [picture]="selectedPicture$ | async"
          ></app-navigation-perspective>
        </ng-container>
      </ng-container>

      <!-- Foreground  -->
      <ng-container foreground>
        <div class="flex flex-column">
          <ng-container *ngIf="imageInBig$ | async">
            <div class="in-front">
              <app-mapbox
                *ngIf="baseMap$ | async as map"
                [baselayers]="map.baselayers"
                [config]="map.config"
                [overlays]="map.overlays"
                [point]="(picturesPoint$ | async)?.geom"
                (position)="getNearestPoint($event)"
                (mapConfig)="setMapConfig($event)"
                [direction]="(selectedPicture$ | async)?.direction"
                [mapInBig]="!(imageInBig$ | async)"
              ></app-mapbox>
            </div>
          </ng-container>
          <ng-container *ngIf="!(imageInBig$ | async) && (picturesPoint$ | async)?.pictures">
            <div class="in-front">
              <app-flat-image
                [picture]="selectedPicture$ | async"
                [matTooltip]="
                  ((selectedPicture$ | async)?.camera | titlecase) +
                  ' camera &bull; ' +
                  ((picturesPoint$ | async)?.timestamp | date: 'medium')
                "
                [matTooltipPosition]="'below'"
              ></app-flat-image>
            </div>
          </ng-container>

          <mat-list *ngIf="(picturesPoint$ | async)?.pictures">
            <mat-list-item>
              <button
                mat-mini-fab
                color="accent"
                (click)="onToggleMinimize()"
                [matTooltip]="
                  (imageInBig$ | async) ? ('imajbox.map.minimize' | transloco) : ('imajbox.image.minimize' | transloco)
                "
                matTooltipPosition="after"
              >
                <mat-icon>menu_open</mat-icon>
              </button>
            </mat-list-item>
            <mat-list-item>
              <button
                mat-mini-fab
                color="accent"
                (click)="onToggleForeground()"
                [matTooltip]="
                  (imageInBig$ | async) ? ('imajbox.map.extand' | transloco) : ('imajbox.image.extand' | transloco)
                "
                matTooltipPosition="after"
              >
                <mat-icon>fullscreen</mat-icon>
              </button>
            </mat-list-item>
            <mat-list-item *ngIf="!(imageInBig$ | async)">
              <button
                mat-mini-fab
                color="accent"
                [matTooltip]="'imajbox.camera.select' | transloco"
                matTooltipPosition="after"
                mat-menu
                [matMenuTriggerFor]="cameraMenu"
                xPosition="after"
              >
                <mat-icon class="icon-size-16">switch_camera</mat-icon>
              </button>
              <mat-menu #cameraMenu="matMenu">
                <ng-container *ngFor="let picture of (picturesPoint$ | async)?.pictures">
                  <button
                    [disabled]="(selectedPicture$ | async)?.camera === picture.camera"
                    mat-menu-item
                    (click)="onChangeCameraPosition(picture.camera)"
                  >
                    {{ picture.camera | titlecase }}
                  </button>
                </ng-container>
              </mat-menu>
            </mat-list-item>
          </mat-list>
        </div>
      </ng-container>

      <!-- Fab  -->
      <ng-container fab>
        <button
          *ngIf="!(imageInBig$ | async) && (picturesPoint$ | async)?.pictures"
          mat-fab
          color="accent"
          (click)="onToggleMinimize()"
          [matTooltip]="'imajbox.fab.images' | transloco"
          matTooltipPosition="after"
          class="relative"
        >
          <mat-icon>camera_alt</mat-icon>
          <span
            class="tip absolute right-0 top-0 -mr-3 mt-2"
            [matBadge]="(picturesPoint$ | async)?.pictures.length"
            matBadgePosition="after"
            matBadgeColor="primary"
          ></span>
        </button>
        <button
          *ngIf="imageInBig$ | async"
          mat-fab
          color="accent"
          (click)="onToggleMinimize()"
          [matTooltip]="'imajbox.fab.map' | transloco"
          matTooltipPosition="after"
        >
          <mat-icon>map</mat-icon>
        </button>
      </ng-container>
    </app-template-one>
  `,
  styles: [
    `
      .tip {
        animation: beat 600ms infinite alternate;
        transform-origin: center;
      }

      @keyframes beat {
        to {
          transform: scale(1.2);
        }
      }
      ::ng-deep .mat-menu-panel {
        margin-top: 10px !important;
      }

      .in-front {
        width: 400px;
        height: 250px;
        min-width: 400px;
        max-width: 400px;
        min-height: 250px;
        max-height: 250px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border-radius: 8px;
        border: 1px solid #bdc2d1;
        overflow: hidden;
        background-color: #e5e7ec;
        cursor: help;
      }

      .top-and-marge {
        top: 100px;
        margin: 10px 10px 0 0;
      }

      .right {
        right: 50px;
      }

      app-navigation-perspective {
        position: absolute;
        bottom: 30px;
        left: calc(50% - 150px);
      }
    `,
  ],
})
export class ImajboxComponent implements OnInit, OnDestroy {
  @Select(BaseMapState.getMap) baseMap$: Observable<BaseMap>
  // TODO : template load bones
  // @Select(BaseMapState.getLoading) isLoading$: Observable<boolean>
  @Select(UiState.getImageInBig) imageInBig$: Observable<boolean>
  @Select(UiState.getMinimize) minimize$: Observable<boolean>
  @Select(PicturesState.getSelectedPicturesPoint) picturesPoint$: Observable<PicturePoint>
  @Select(PicturesState.getSelectedPicture) selectedPicture$: Observable<Picture>
  @Select(RouterSelectors.queryParams) queryParams$: Observable<Params>
  mapIsLoaded = false
  dragEnd = false

  myFlagForSlideToggle = true

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.queryParams$.pipe(take(1)).subscribe((queryParams) => {
      this.initState(queryParams)
    })
  }

  private initState(params: Params) {
    const bbox = params[QueryParamsFromImajebox.bbox]
    const point = params[QueryParamsFromImajebox.point]
    const minimize = params[QueryParamsFromImajebox.minimize]
    const image = params[QueryParamsFromImajebox.image]
    const camera = params[QueryParamsFromImajebox.camera]

    if (bbox) {
      this.store.dispatch(new LoadBaseMapWithParams(bbox))
    } else {
      this.store.dispatch(new LoadBaseMap())
    }
    if (point) {
      this.store.dispatch(new LoadPicturesPointById(point))
    }
    if (minimize) {
      this.store.dispatch(new SetMinimize(minimize))
    }
    if (image) {
      this.store.dispatch(new SetForeground(image))
    }
    if (camera) {
      this.store.dispatch(new ChangeCameraPosition(camera))
    }
  }

  onToggleForeground(): void {
    this.mapIsLoaded = false
    this.store.dispatch(new ToggleForeground())
  }

  onToggleMinimize(): void {
    this.store.dispatch(new ToggleMinimize())
  }

  onChangeCameraPosition(position: CameraPositionType): void {
    this.store.dispatch(new ChangeCameraPosition(position))
  }

  getNearestPoint(position: GeoJSON.Position) {
    const distance = 120
    this.store.dispatch(new LoadPicturesPointByLngLat({ position, distance }))
    if (this.dragEnd) {
      this.store.dispatch(new ToggleForeground())
    }
    this.dragEnd = false
  }

  setMapConfig(evt: Partial<MapConfig>) {
    this.store.dispatch(new SetMapConfig(evt))
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }
}