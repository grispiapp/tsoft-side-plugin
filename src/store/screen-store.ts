import { RootStore } from "./root-store";
import { makeAutoObservable } from "mobx";

export type ScreenType =
  | "search"
  | "customer-details"
  | "order-details"
  | "splash";

export class ScreenStore {
  rootStore: RootStore;
  screen: ScreenType = "search";
  screenParams: Record<string, any> = {};
  previousScreen: ScreenType | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  setScreen = (screen: ScreenType, params: Record<string, any> = {}) => {
    this.previousScreen = this.screen;
    this.screen = screen;
    this.screenParams = params;
  };
}
