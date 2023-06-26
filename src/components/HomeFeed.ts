import { Lightning } from "@lightningjs/sdk";
import { HomeFeed } from "../global";
import HomeHeroComponent from "./HomeHero";
import CuratedCardComponent from "./CuratedCard";
import ContinueWatchingComponent from "./ContinueWatching";
import CollectionComponent from "./Collection";
import { Column } from "@lightningjs/ui-components";

// "hero" | "mini-hero" | "continue-watching" | "carousel"
function getComponent(type: string) {
  switch (type) {
    case "hero":
      return HomeHeroComponent;
    case "mini-hero":
      return CuratedCardComponent;
    case "continue-watching":
      return ContinueWatchingComponent;
    case "carousel":
      return CollectionComponent;
  }

  return undefined;
}

export default class HomeFeedComponent extends Lightning.Component {
  currentFocusedId = 0;
  _data?: Partial<HomeFeed>;

  static override _template() {
    return {
      w: 1920,
      h: 1080,
      HomeFeedItems: {
        type: Column,
      },
    };
  }

  set data(x: Partial<HomeFeed>) {
    if (x.items) {
      // if (this._data)
      let items = x.items;
      const currentLength = this._data?.items?.length || 0;

      if (currentLength) {
        items = items.slice(currentLength);
      }

      this.tag("HomeFeedItems").appendItems(
        items.map((item) => ({ type: getComponent(item.type), data: item }))
      );
      this._data = x;
    }
  }

  override _getFocused() {
    return this.tag("HomeFeedItems");
  }
}
