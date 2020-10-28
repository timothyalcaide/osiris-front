import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ImageMapBisComponent } from './containers/image-map-bis.component'
import { ImageMapComponent } from './containers/image-map.component'
import { MapsListComponent } from './containers/maps-list.component'


const routes: Routes = [
      {
        path: '', 
        component: MapsListComponent
      },
      {
        path: 'diagnosis',
        loadChildren: () => import('./modules/diagnosis/diagnosis.module').then((m) => m.DiagnosisModule),
      }, 
      {
        path: 'imajebox',
        component: ImageMapBisComponent
      },
      {
        path: 'roadview',
        component: ImageMapComponent
      },
      {
        path: '**', 
        pathMatch: 'full',
        redirectTo: ''
      }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }