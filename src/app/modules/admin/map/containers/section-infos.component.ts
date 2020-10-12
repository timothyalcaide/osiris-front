import { Component, OnDestroy, OnInit } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { ID } from 'app/shared/shared.model'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { Section } from '../models/section.model'
import { BaseMapState, CloseDrawer, GetSectionById, OpenDrawer } from '../store'
import { SectionsState } from '../store/states/section.state'
import { TreoMediaWatcherService } from './../../../../../@treo/services/media-watcher/media-watcher.service'
import { CustomMapComponent } from './map.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-section-infos',
  template: `
    <aside *transloco="let t">
      <div class="flex items-center justify-between bg-gray-50 px-5 py-3 border-b border-gray-200">
        <div class="text-2xl font-medium leading-tight">{{ t('map.info.title') }}</div>

        <div class="-mr-3">
          <button *ngIf="isScreenSmall" mat-icon-button (click)="onClose()">
            <mat-icon>close</mat-icon>
          </button>
          <ng-container *ngIf="!isScreenSmall">
            <button mat-icon-button *ngIf="selectedSection$ | async as section" (click)="goToSection(section)">
              <mat-icon [matTooltipPosition]="'below'" [matTooltip]="t('map.info.tooltip')"
                >location_searching</mat-icon
              >
            </button>
          </ng-container>
        </div>
      </div>
      <ng-container *ngIf="(selectedSection$ | async)?.id; else noSection">
        <dl *ngIf="(selectedSection$ | async)?.properties as sectionProp">
          <div class="px-4 py-3 mt-2">
            <dt class="leading-5 font-medium text-gray-500">
              {{ t('map.info.characteristics') }}
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md">
                <li class="pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">{{ t('map.info.state') }}: </span>
                  {{ sectionProp.state ? (sectionProp.state | titlecase) : 'Inconnu' }}
                  <mat-icon
                    class="icon-size-12 text-gray cursor-pointer"
                    [svgIcon]="'dripicons:question'"
                    [matTooltipPosition]="'right'"
                    matTooltip="Good / Medium / Bad / Very bad"
                  ></mat-icon>
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <div class="flex">
                    <div class="flex-1">
                      <span class="font-medium mr-1">{{ t('map.info.length') }}: </span>
                      {{ sectionProp.length ? sectionProp.length + ' m' : 'null' }}
                    </div>
                    <div class="flex-1">
                      <span class="font-medium mr-1">{{ t('map.info.width') }}: </span>
                      {{ sectionProp.width ? sectionProp.width + ' m' : 'null' }}
                    </div>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
          <div class="px-4 py-3">
            <dt class="leading-5 font-medium mr-1 text-gray-500">
              {{ t('map.info.localisation') }}
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md">
                <li class="pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">{{ t('map.info.street') }}: </span>
                  {{ sectionProp.streetName ? (sectionProp.streetName | titlecase) : '-' }}
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">{{ t('map.info.neighborhood') }}: </span>
                  {{ sectionProp.neighborhood ? (sectionProp.neighborhood | titlecase) : '-' }}
                </li>
                <li class="border-t border-gray-200 pl-3 pr-4 py-3 text-sm leading-5">
                  <span class="font-medium mr-1">{{ t('map.info.city') }}: </span>
                  {{ sectionProp.city ? (sectionProp.city | titlecase) : '-' }}
                </li>
              </ul>
            </dd>
          </div>
          <div class="px-4 py-3" *ngIf="sectionProp.optionalProperties.length > 0">
            <dt class="leading-5 font-medium mr-1 text-gray-500">
              {{ t('map.info.further') }}
            </dt>
            <dd class="mt-3 text-sm leading-5 text-gray-900">
              <ul class="border border-gray-200 rounded-md py-3">
                <li
                  class=" border-gray-200 pl-3 pr-4 py-1 text-sm leading-5"
                  *ngFor="let item of sectionProp.optionalProperties"
                >
                  <span class="font-medium mr-1">{{ item.key | titlecase }}: </span>
                  {{ item.value | titlecase }}
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </ng-container>
      <ng-template #noSection>
        <div class="px-4 py-3 mt-2" *ngIf="id$ | async as id">{{ t('map.info.no', { id: id }) }}</div>
      </ng-template>
    </aside>
  `,
})
export class SectionInfosComponent implements OnInit, OnDestroy {
  @Select(SectionsState.getSelectedSection) selectedSection$: Observable<Section>
  @Select(SectionsState.getSectionColor) sectionColor$: Observable<string>
  @Select(BaseMapState.getMapIsRender) mapIsRender$: Observable<boolean>
  @Select((state) => state.router.state.params.id) id$: Observable<ID>
  isScreenSmall: boolean

  constructor(private mapComponent: CustomMapComponent, private store: Store, private media: TreoMediaWatcherService) {}

  ngOnInit(): void {
    this.id$.subscribe((id) => {
      if (id !== undefined) {
        this.store.dispatch(new GetSectionById(id))
      }
    })

    this.media.onMediaChange$.subscribe(({ matchingAliases }) => {
      this.isScreenSmall = matchingAliases.includes('xs')
    })

    this.selectedSection$.subscribe(section => {   
      this.mapIsRender$.subscribe(isLoad => {  
        if (isLoad && section) {     
          setTimeout(() => {
            this.openDrawer()
            this.goToSection(section)
          })   
        }
      })
    })
  }

  goToSection(section: Section): void {
    this.flyToSection(section)
    setTimeout(() => this.displaySelectedSection(section), 250)
  }

  onClose() {
    this.store.dispatch(new CloseDrawer())
  }

  private flyToSection(section: Section): void {
    // padding right depend of the drawer size (375px)
    // don't tuch padding because bug !
    this.mapComponent.mapInstance.fitBounds([section.bbox[0], section.bbox[1], section.bbox[2], section.bbox[3]], {
      padding: { top: 200, bottom: 200, left: 200, right: 575 },
      maxDuration: 2000
    })
  }

  private displaySelectedSection(section: Section): void {
    if (section.geometry) {
      const map = this.mapComponent.mapInstance
      const id = 'selectedSection'

      this.sectionColor$.subscribe((color) => {
        this.removeSourceAndLayer('selectedSection')

        map.addSource(id, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
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
            'line-color': color,
            'line-width': 18,
            'line-blur': 1.5,
            'line-opacity': 0.6,
          },
        })
      })
    }
  }

  private removeSourceAndLayer(id: string): void {
    const map = this.mapComponent.mapInstance
    if (map.getLayer(id) && map.getSource(id)) {
      map.removeLayer(id)
      map.removeSource(id)
    }
  }

  private openDrawer(): void {
    this.store.dispatch(new OpenDrawer())
  }

  // Use in section guards
  public closeDrawer(): Promise<boolean> {
    return this.store.dispatch(new CloseDrawer()).toPromise()
  }

  ngOnDestroy(): void {
    this.removeSourceAndLayer('selectedSection')
    this.closeDrawer()
  }
}
