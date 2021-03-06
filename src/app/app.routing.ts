import { NgModule } from '@angular/core'
import { ExtraOptions, Params, Route, RouterModule, RouterStateSnapshot } from '@angular/router'
import { RouterStateSerializer } from '@ngxs/router-plugin'
import { InitialDataResolver } from 'app/app.resolvers'
import { LayoutComponent } from 'app/layout/layout.component'
import { AuthGuard } from './modules/auth/guards/auth.guard'
import { NoAuthGuard } from './modules/auth/guards/noAuth.guard'

const routerConfig: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
}

// @formatter:off
// tslint:disable:max-line-length
export const routes: Route[] = [
  // Redirect empty path to '/map'
  { path: '', pathMatch: 'full', redirectTo: 'imajbox' },

  // Redirect signed in user to the '/map'
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'imajbox' },

  // Auth routes (guest)
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      // {path: 'confirmation-required', loadChildren: () => import('./modules/pages/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
      // {path: 'forgot-password', loadChildren: () => import('./modules/pages/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
      // {path: 'reset-password', loadChildren: () => import('./modules/pages/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
      {
        path: 'sign-in',
        loadChildren: () => import('./modules/pages/sign-in/sign-in.module').then((m) => m.AuthSignInModule),
      },
      // {path: 'sign-up', loadChildren: () => import('./modules/pages/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
    ],
  },

  // Auth routes (logged in)
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('./modules/pages/sign-out/sign-out.module').then((m) => m.AuthSignOutModule),
      },
      // {path: 'unlock-session', loadChildren: () => import('./modules/pages/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
    ],
  },

  // Landing routes
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/landing/home/home.module').then((m) => m.LandingHomeModule),
      },
    ],
  },

  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: 'imajbox',
        loadChildren: () => import('./modules/imajbox/imajbox.module').then((m) => m.ImajboxModule),
      },
      {
        path: 'diagnosis',
        loadChildren: () => import('./modules/diagnosis/diagnosis.module').then((m) => m.DiagnosisModule),
      },
      {
        path: 'roadview',
        loadChildren: () => import('./modules/roadview/roadview.module').then((m) => m.RoadviewModule),
      },
      {
        path: 'maps',
        loadChildren: () => import('./modules/maps/maps.module').then((m) => m.MapsModule),
        data: { title: 'Maps' },
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data: { title: 'Dashboard' },
      },
      {
        path: 'works',
        loadChildren: () => import('./modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data: { title: 'Travaux' },
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data: { title: 'Settings' },
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/pages/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
        data: { title: 'Profile' },
      },

      // 404 & Catch all
      {
        path: '404-not-found',
        pathMatch: 'full',
        loadChildren: () => import('./modules/pages/errors/error-404/error-404.module').then((m) => m.Error404Module),
      },
      { path: '**', redirectTo: '404-not-found' },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export interface RouterStateParams {
  url: string
  params: Params
  queryParams: Params
}

// Map the router snapshot to { url, params, queryParams }
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateParams> {
  serialize(routerState: RouterStateSnapshot): RouterStateParams {
    const {
      url,
      root: { queryParams },
    } = routerState

    let { root: route } = routerState
    while (route.firstChild) {
      route = route.firstChild
    }

    const { params } = route

    return { url, params, queryParams }
  }
}
