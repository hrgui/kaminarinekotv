import { Colors, Img, Lightning } from "@lightningjs/sdk";
import { ContentFeed } from "../global";
import Button from "./Button";
import Router from "@lightningjs/sdk/src/Router";
import { getContentGroupSubbedDubbed } from "../computed/content";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default class CuratedCardComponent extends Lightning.Component {
  data?: ContentFeed;

  static override _template() {
    return {
      w: 1920,
      h: 608,
      flex: { paddingLeft: 90, direction: "row", paddingTop: 40 },
      ContentText: {
        w: 796,
        h: 504,
        flex: { direction: "column" },
        TitleText: {
          text: {
            text: "Header",
            fontFace: "Semibold",
            fontSize: 56,
            lineHeight: 72,
            textColor: Colors("alabaster").get(),
          },
        },
        TagLine: {
          text: {
            text: "TagLine",
            fontFace: "Bold",
            fontSize: 28,
            lineHeight: 40,
            textColor: Colors("silverChalice").get(),
          },
        },
        Description: {
          text: {
            text: "Description",
            fontFace: "Bold",
            fontSize: 28,
            lineHeight: 40,
            textColor: Colors("silver").get(),
            wordWrap: true,
            wordWrapWidth: 700,
          },
        },
        Buttons: {
          flex: { direction: "row" },
          UpNextButton: {
            w: 240,
            type: Button,
            buttonText: "WATCH NOW",
          },
          MoreInfoButton: {
            w: 240,
            type: Button,
            buttonText: "MORE INFO",
          },
        },
      },
      Image: {
        w: 896,
        h: 504,
        // texture: Lightning.Tools.getRoundRect(896, 504, 0),
        // color: 0xff1f1f1f,
      },
    };
  }

  get content() {
    const content = this.data?.items[0];
    return content;
  }

  static override _states() {
    return [
      class UpNextButton extends this {
        override _getFocused() {
          return this.tag("UpNextButton");
        }

        override _handleEnter() {
          Router.navigate(`watch/${this.content?.id}/upnext`);
        }

        override _handleRight() {
          this._setState("MoreInfoButton");
        }
      },
      class MoreInfoButton extends this {
        override _handleEnter() {
          Router.navigate(`content/${this.content?.id}`);
        }

        override _getFocused() {
          return this.tag("MoreInfoButton");
        }

        override _handleLeft() {
          this._setState("UpNextButton");
        }
      },
    ];
  }

  override _init() {
    this._setState("UpNextButton");

    const content = this.data?.items[0];

    // image background
    if (content) {
      if (content && content.images?.asPageHeader) {
        // console.log(Img(content.images?.asPageHeader).cover(1920, 904));
        this.tag("Image").texture = Img(content.images?.asPageHeader).contain(896, 504);

        // this.tag("Background").texture.alpha = 0.05;
        // this.tag("Background").shader = {
        //   type: Lightning.shaders.Vignette,
        //   magnitude: 1,
        //   intensity: 0.1,
        // };
      }

      // ContentText
      if (content.title) {
        this.tag("TitleText").patch({
          text: {
            text: content.title,
          },
        });
      }

      // tagline

      const tags = [getContentGroupSubbedDubbed(content), content.genres?.join(", ")];

      const tagLine = tags.join(" ◆ ");

      if (tagLine) {
        this.tag("TagLine").patch({
          text: {
            text: tagLine,
          },
        });
      }

      if (content.description) {
        this.tag("Description").patch({
          text: {
            text: content.description,
          },
        });
      }
    }
  }
}
