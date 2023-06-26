import { Lightning } from "@lightningjs/sdk";
import { getHomeFeed } from "../api-client";
import HomeFeedComponent from "../components/HomeFeed";
import { HomeFeed } from "../global";

export default class Home extends Lightning.Component {
  currentPage = 1;
  hasMore?: boolean = true;
  isFetching?: boolean = false;

  static override _template() {
    return {
      w: 1920,
      h: 1080,
      Background: {
        w: 1920,
        h: 1080,
        colorBottom: 0xff000000,
      },
      HomeFeed: {
        type: HomeFeedComponent,
        data: {},
        x: 0,
        y: 0,
      },
    };
  }

  override async _init() {
    console.log("HOME _init");
    const homeFeed = await getHomeFeed(this.currentPage);
    this.tag("HomeFeed").patch({
      data: homeFeed,
    });
    this.hasMore = homeFeed.hasMore;
  }

  override get id() {
    return "Home";
  }

  override _getFocused() {
    return this.tag("HomeFeed");
  }

  async getMoreItems() {
    console.log(this.hasMore);

    if (this.hasMore) {
      this.isFetching = true;
      // ideally should be after
      this.currentPage = this.currentPage + 1;
      console.log(this.currentPage);
      const nextSetItems = await getHomeFeed(this.currentPage);

      const currentItemSet = this.tag("HomeFeed")._data;

      this.tag("HomeFeed").patch({
        data: {
          items: [...currentItemSet.items, ...nextSetItems.items],
          hasMore: nextSetItems.hasMore,
        },
      });

      this.hasMore = nextSetItems.hasMore;

      this.isFetching = false;
    }
  }

  checkRequestMoreItems() {
    if (!this.isFetching) {
      this.getMoreItems();
    }
  }

  override _handleDown() {
    this.checkRequestMoreItems();
  }
}
