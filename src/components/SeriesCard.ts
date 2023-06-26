import { Lightning, Colors, Img, Router } from "@lightningjs/sdk";
import { ContentGroup } from "../global";

export default class SeriesCardComponent extends Lightning.Component {
  data?: ContentGroup;

  static override _template() {
    return {
      // texture: Lightning.Tools.getRoundRect(274, 520, 0),
      w: 274,
      h: 520,
      texture: Lightning.Tools.getRoundRect(274, 520, 0),
      color: Colors("woodsmoke").get(),
      flex: { direction: "column" as any },
      // smooth: { color: 0xffffffff },
      Image: {
        x: 0,
        y: 0,
        w: 274,
        h: 420,
        shader: {
          type: Lightning.shaders.Vignette,
          magnitude: 0.5,
          intensity: 0.3,
        },
      },
      Label: {
        x: 0,
        y: 12,
        text: {
          paddingTop: 12,
          paddingLeft: 16,
          paddingRight: 16,
          mount: 0.5,
          text: "",
          fontSize: 28,
          lineHeight: 40,
          color: Colors("white").get(),
          zIndex: 3,
          wordWrap: true,
          wordWrapWidth: 200,
        },
      },
      // color: 0xff1f1f1f,
    };
  }

  override _init() {
    const title = this.data?.title;
    const image = this.data?.images?.asFeed;

    if (title) {
      this.tag("Label").patch({
        text: {
          text: title,
        },
      });
    }

    if (image) {
      this.tag("Image").texture = Img(image).contain(274, 420);
    }
  }

  override _handleEnter() {
    Router.navigate(`content/${this.data?.id}`);
  }

  override _focus() {
    this.color = Colors("white").get();
    this.tag("Label").color = Colors("woodsmoke").get();
    this.tag("Image").shader.magnitude = 0;
  }

  override _unfocus() {
    this.color = Colors("woodsmoke").get();
    this.tag("Label").color = Colors("white").get();
    this.tag("Image").shader.magnitude = 0.5;
  }
}
