import { Language, Theme } from '../../../shared/models/shared.model'

export class OpenSidenav {
  static readonly type = '[Config] Open Sidenav'
}

export class CloseSidenav {
  static readonly type = '[Config] Close Sidenav'
}

export class ChangeTheme {
  static readonly type = '[Config] Change Theme'
  constructor(public payload: Theme) {}
}

export class ChangeLanguage {
  static readonly type = '[Config] Change Language'
  constructor(public payload: Language) {}
}
