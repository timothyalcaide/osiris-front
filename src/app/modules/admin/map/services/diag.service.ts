import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Layer } from 'mapbox-gl'
import { Observable, of } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'
import { Section } from './../models/section.model'

@Injectable({
  providedIn: 'root',
})
export class DiagService {
  apiCarto = environment.osiris.api.carto
  apiDiag = environment.osiris.api.diag

  canClick = true

  constructor(private http: HttpClient) {}

  getLayers(): Observable<Layer[]> {
    return this.http.get<Layer[]>(`${this.apiCarto}/carto/layers/sections`)
  }

  getSection(point: { lng: number; lat: number }): Observable<Section> {
    return this.http.get<number>(`${this.apiCarto}/carto/layers/section?lng=${point.lng}&lat=${point.lat}`).pipe(
      mergeMap((sectionId) => this.http.get<Section>(`${this.apiDiag}/diag/section/${sectionId}`)),
      catchError((err: HttpErrorResponse) => of(null))
    )
  }

  getSectionIdByLngLat(point: { lng: number; lat: number }): Observable<number> {
    return this.http.get<number>(`${this.apiCarto}/carto/layers/section?lng=${point.lng}&lat=${point.lat}`)
  }

  getSectionById(id: string): Observable<Section> {
    return this.http.get<Section>(`${this.apiDiag}/diag/section/${id}`)
  }
}
