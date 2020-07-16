import { Component, OnInit } from '@angular/core'
import { MapMouseEvent } from 'mapbox-gl'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Section } from '../models/map.model'
import { MapService } from '../services/map.service'
import { TreoDrawerService } from './../../../../../@treo/components/drawer/drawer.service'

@Component({
  selector: 'app-map',
  styleUrls: ['./map.component.scss'],
  template: `
    <div class="content-layout right-sidebar-fullheight-basic-inner-scroll">
      <treo-drawer
        [name]="'sectionDetails'"
        [mode]="'over'"
        [fixed]="false"
        [position]="'right'"
        [transparentOverlay]="true"
        #sectionDetails
      >
        <div class="flex flex-col w-full light:bg-cool-gray-100 overflow-auto p-3">
          test
        </div>
      </treo-drawer>
      <mgl-map
        [style]="'mapbox://styles/mapbox/outdoors-v9'"
        [zoom]="13.5"
        [center]="[2.189, 48.926]"
        [pitch]="0"
        [bearing]="0"
        [maxZoom]="20"
        [minZoom]="12"
        [cursorStyle]="cursorStyle"
        [fitBounds]="fit"
      >
        <mgl-control mglGeocoder position="top-right"></mgl-control>
        <mgl-control mglFullscreen position="top-left"></mgl-control>
        <mgl-control mglNavigation position="top-left"></mgl-control>
        <mgl-control mglScale position="bottom-right"></mgl-control>

        <app-layer
          *ngFor="let layer of layers"
          [id]="layer.id"
          [data]="layer.data | async"
          [color]="layer.color"
          (cursor)="toggleCursorStyle($event)"
          (selected)="onClick($event)"
        ></app-layer>
      </mgl-map>
    </div>
  `,
})
export class MapComponent implements OnInit {
  sections$: Observable<Section[]>
  goodSections$: Observable<Section[]>
  mediumSections$: Observable<Section[]>
  poorSections$: Observable<Section[]>
  veryPoorSections$: Observable<Section[]>
  outSections$: Observable<Section[]>
  cursorStyle = ''
  layers: any
  fit: any

  constructor(private _mapService: MapService, private _treoDrawerService: TreoDrawerService) {}

  ngOnInit(): void {
    this.sections$ = this._mapService.getSections()
    this.generateLayers()
    this.layers = [
      { id: 'good', data: this.goodSections$, color: '#48bb78' },
      { id: 'medium', data: this.mediumSections$, color: '#ecc94b' },
      { id: 'poor', data: this.poorSections$, color: '#ed8936' },
      { id: 'vary_poor', data: this.veryPoorSections$, color: '#e53e3e' },
      { id: 'out', data: this.outSections$, color: '#cbd5e0' },
    ]
  }

  private generateLayers(): void {
    this.goodSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Bon'))
    )
    this.mediumSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Moyen'))
    )
    this.poorSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Mauvais'))
    )
    this.veryPoorSections$ = this.sections$.pipe(
      map((sections) => sections.filter((section) => section.properties.etat_ch === 'Très mauvais'))
    )
    this.outSections$ = this.sections$.pipe(
      map((sections) =>
        sections.filter(
          (section) =>
            section.properties.etat_ch !== 'Bon' &&
            section.properties.etat_ch !== 'Moyen' &&
            section.properties.etat_ch !== 'Mauvais' &&
            section.properties.etat_ch !== 'Très mauvais'
        )
      )
    )
  }

  toggleCursorStyle(evt: string): void {
    evt === '' ? (this.cursorStyle = '') : (this.cursorStyle = 'pointer')
  }

  onClick(evt: MapMouseEvent): void {
    this.fit = [
      [evt.lngLat.lng - 0.001, evt.lngLat.lat - 0.001],
      [evt.lngLat.lng + 0.001, evt.lngLat.lat + 0.001],
    ]
    this.toggleDrawer('sectionDetails')
  }

  private toggleDrawer(drawerName: string): void {
    const drawer = this._treoDrawerService.getComponent(drawerName)
    drawer.toggle()
  }
}
