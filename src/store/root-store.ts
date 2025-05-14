import { CurrentUserStore } from "./current-user-store";
import { ScreenStore } from "./screen-store";

export class RootStore {
  currentUser: CurrentUserStore;
  screen: ScreenStore;

  constructor() {
    this.currentUser = new CurrentUserStore(this);
    this.screen = new ScreenStore(this);
  }
}
