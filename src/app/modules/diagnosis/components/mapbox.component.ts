import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { Map, MapMouseEvent, Visibility } from 'mapbox-gl'
import { Baselayer, MapConfig, Overlay } from '../../../shared/models/maps.model'
import { Section } from './../models/section.model'
import { MapboxService } from './../services/mapbox.service'

@Component({
  selector: 'app-mapbox',
  template: `
    <mgl-map
      *ngIf="config && baselayers"
      class="h-full w-full"
      [style]="baselayers[config.style]?.url"
      [bounds]="config.bounds"
      [bearing]="config.bearing"
      [pitch]="config.pitch === null ? 0 : config.pitch"
      [zoom]="config.zoom"
      [center]="config.center"
      [maxBounds]="config.maxBounds"
      [minZoom]="config.minZoom === null ? 0 : config.minZoom"
      [maxZoom]="config.maxZoom === null ? 25 : config.maxZoom"
      [movingMethod]="'easeTo'"
      [attributionControl]="false"
      [cursorStyle]="cursorStyle"
      (load)="onLoad($event)"
      (dragEnd)="mapConfig.emit(baseMapConfig)"
      (zoomEnd)="mapConfig.emit(baseMapConfig)"
      (pitchEnd)="mapConfig.emit(baseMapConfig)"
      (click)="onClick($event)"
    >
      <ng-container *ngIf="isLoaded">
        <!-- Controls -->
        <mgl-control mglNavigation position="top-left"></mgl-control>
        <mgl-control mglScale position="bottom-left"></mgl-control>
        <mgl-control
          mglGeocoder
          [proximity]="config.center"
          [bbox]="config.bounds"
          placeholder="Recherche"
          position="bottom-right"
        ></mgl-control>

        <!-- Layers  -->
        <app-buildings-layer [visible]="baseMapConfig.pitch > 30"></app-buildings-layer>

        <ng-container *ngIf="overlays">
          <ng-container *ngFor="let layer of overlays">
            <ng-container *ngIf="layer.type === 'raster'">
              <mgl-raster-source
                [id]="layer.id"
                [tiles]="layer.source.tiles"
                [tileSize]="layer.source.tileSize"
              ></mgl-raster-source>
              <mgl-layer
                [id]="layer.id"
                [type]="layer.type"
                [source]="layer.id"
                [layout]="{ visibility: booleanToVisibility(layer.visible) }"
              ></mgl-layer>
            </ng-container>
          </ng-container>
        </ng-container>

        <!-- Markers  -->
      </ng-container>
    </mgl-map>
  `,
})
export class MapboxComponent implements OnChanges {
  @Input() config: MapConfig
  @Input() baselayers: Baselayer[]
  @Input() overlays: Overlay[]
  @Input() section: Section

  @Output() mapConfig = new EventEmitter<Partial<MapConfig>>()
  @Output() getSection = new EventEmitter<GeoJSON.Position>()
  @Output() getMapInstance = new EventEmitter<Map>()

  cursorStyle: string
  isLoaded = false
  mapInstance: Map

  constructor(private mapboxService: MapboxService) {}

  onLoad(evt: Map) {
    this.isLoaded = true
    this.getMapInstance.emit(evt)
    this.mapInstance = evt
  }

  onClick(evt: MapMouseEvent): void {
    if (evt.lngLat) {
      const { lng, lat } = evt.lngLat
      this.getSection.emit([lng, lat])
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'section':
            this.goToSection(this.section, this.mapInstance)
            break
        }
      }
    }
  }

  booleanToVisibility(visible: boolean): Visibility {
    return visible ? 'visible' : 'none'
  }

  private goToSection(section: Section, map: Map): void {
    if (section && map) {
      this.mapboxService.flyToSection(section, map)
      setTimeout(() => this.displaySelectedSection(section, map), 200)
    }
  }

  get baseMapConfig(): Partial<MapConfig> {
    const { lng, lat } = this.mapInstance.getCenter()
    return {
      center: [lng, lat],
      zoom: this.mapInstance.getZoom(),
      pitch: this.mapInstance.getPitch(),
      bearing: this.mapInstance.getBearing(),
      bounds: this.mapInstance.getBounds(),
    }
  }

  private displaySelectedSection(section: Section, map: Map): void {
    if (section.geometry) {
      const id = 'selectedSection'
      this.removeSourceAndLayer('selectedSection', map)

      map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: section.geometry.type,
                coordinates: section.geometry.coordinates,
              },
            },
          ],
        },
      })

      map.addLayer({
        id: id,
        source: id,
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#444',
          'line-width': 18,
          'line-blur': 1.5,
          'line-opacity': 0.6,
        },
      })
    }
  }

  private removeSourceAndLayer(id: string, map: Map): void {
    if (map.getLayer(id)) {
      map.removeLayer(id)
    }
    if (map.getSource(id)) {
      map.removeSource(id)
    }
  }
}
