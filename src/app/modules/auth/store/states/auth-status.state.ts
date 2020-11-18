import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { AuthService } from '../../services/auth.service'
import { LoginRedirect, Logout } from '../actions/auth.actions'
import { IsAuth } from './../actions/auth.actions'

export interface AuthStatusStateModel {
  loggedIn: boolean
  jwt: string | null
  email: string | null
}

const authStatusStateDefaults: AuthStatusStateModel = {
  loggedIn: false,
  jwt: null,
  email: null,
}

@State<AuthStatusStateModel>({
  name: 'status',
  defaults: authStatusStateDefaults,
})
@Injectable()
export class AuthStatusState {
  constructor(private authService: AuthService) {}

  @Selector()
  static getLoggedIn(state: AuthStatusStateModel): boolean {
    return state.loggedIn
  }

  @Selector()
  static getJWT(state: AuthStatusStateModel): string {
    return state.jwt
  }

  @Selector()
  static getEmail(state: AuthStatusStateModel): string {
    return state.email
  }

  @Action(IsAuth)
  isAuth({ patchState }: StateContext<AuthStatusStateModel>, action: IsAuth) {
    patchState({
      loggedIn: true,
      jwt: action.payload.jwt,
      email: action.payload.login,
    })
  }

  @Action([Logout, LoginRedirect])
  logout({ dispatch, setState }: StateContext<AuthStatusStateModel>) {
    localStorage.removeItem('auth.status')
    setState(authStatusStateDefaults)
    dispatch(new Navigate(['sign-out']))
  }

  //   @Action(RequestForgottenPassword)
  //   requestForgottenPassword(ctx: StateContext<AuthStatusStateModel>, action: RequestForgottenPassword) {
  //     this.authService.forgottenPasswordRequest(action.email)
  //   }

  //   @Action(ValidationForgottenPassword)
  //   validationForgottenPassword(ctx: StateContext<AuthStatusStateModel>, action: ValidationForgottenPassword) {
  //     this.authService.forgottenPasswordValidation(action.payload)
  //   }

  //   @Action(ResetForgottenPassword)
  //   resetForgottenPassword(ctx: StateContext<AuthStatusStateModel>, action: ResetForgottenPassword) {
  //     this.authService.forgottenPasswordReset(action.payload)
  //   }
}
