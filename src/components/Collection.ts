import { Lightning } from "@lightningjs/sdk";
import { ContentFeed } from "../global";
import { Row } from "@lightningjs/ui-components";
import SeriesCardComponent from "./SeriesCard";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default class CollectionComponent extends Lightning.Component {
  data?: ContentFeed;

  static override _template() {
    return {
      w: 1920,
      h: 608,
      flex: { paddingTop: 40, paddingLeft: 90, direction: "column" },
      Header: {
        x: 0,
        y: 0,
        text: {
          text: "Collection",
          fontFace: "Semibold",
          fontSize: 40,
          lineHeight: 48,
          textColor: 0xbbffffff,
        },
      },
      CollectionList: {
        type: Row,
        lazyScroll: true,
        w: 1814, // 90 16
        h: 540,
        items: [],
      },
    };
  }

  get content() {
    return this.data?.items || [];
  }

  get title() {
    return this.data?.title;
  }

  override _getFocused() {
    return this.tag("CollectionList");
  }

  override _init() {
    // this.content
    if (this.title) {
      this.tag("Header").patch({
        text: {
          text: this.title,
        },
      });
    }

    if (this.content) {
      this.tag("CollectionList").appendItems(
        this.content.map((c) => ({
          type: SeriesCardComponent,
          data: c,
        }))
      );
    }
  }
}
