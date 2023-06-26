import { Lightning, Img, Colors, Router } from "@lightningjs/sdk";
import { getContentGroupSubbedDubbed } from "../computed/content";
import { ContentFeed } from "../global";
import Button from "./Button";

export default class HomeHeroComponent extends Lightning.Component {
  data?: ContentFeed;

  static override _template() {
    return {
      w: 1920,
      h: 904,
      Background: {},
      ContentText: {
        x: 90,
        y: 316,
        w: 800,
        flex: { direction: "column" },
        TitleText: {
          text: {
            fontFace: "Semibold",
            fontSize: 56,
            lineHeight: 72,
            textColor: Colors("silver").get(),
          },
        },
        TagLine: {
          text: {
            fontFace: "Bold",
            fontSize: 28,
            lineHeight: 40,
            textColor: Colors("silverChalice").get(),
          },
        },
        Description: {
          text: {
            fontFace: "Bold",
            fontSize: 28,
            lineHeight: 40,
            textColor: Colors("silver").get(),
          },
        },
        Buttons: {
          flex: { direction: "row" },
          UpNextButton: {
            type: Button,
            buttonText: "WATCH NOW",
          },
          MoreInfoButton: {
            type: Button,
            buttonText: "MORE INFO",
          },
        },
      },
    };
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

  get content() {
    const content = this.data?.items[0];
    return content;
  }

  override _init() {
    this._setState("UpNextButton");

    const content = this.data?.items[0];

    // image background
    if (content) {
      if (content && content.images?.asPageHeader) {
        // console.log(Img(content.images?.asPageHeader).cover(1920, 904));
        this.tag("Background").texture = Img(content.images?.asPageHeader).cover(1920, 904);

        // this.tag("Background").texture.alpha = 0.05;
        this.tag("Background").shader = {
          type: Lightning.shaders.Vignette,
          magnitude: 1,
          intensity: 0.1,
        };
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
