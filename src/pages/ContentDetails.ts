import { Colors, Img, Lightning } from "@lightningjs/sdk";
import { ContentGroup } from "../global";
import Router from "@lightningjs/sdk/src/Router";
import { getContentGroupSubbedDubbed } from "../computed/content";
import Button from "../components/Button";

export default class ContentDetails extends Lightning.Component {
  data?: ContentGroup;

  static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
    return {
      w: 1920,
      h: 1080,

      Background: {},
      Content: {
        flex: { direction: "row" },
        ContentText: {
          x: 90,
          y: 76,
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
            flex: { direction: "column", paddingTop: 420 },
            AddToWatchlistButton: {
              type: Button,
              buttonText: "ADD TO WATCHLIST",
            },
            UpNextButton: {
              type: Button,
              buttonText: "WATCH NOW",
            },
          },
        },
        Image: {
          y: 76,
          x: 300,
          w: 552,
          h: 828,
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
          Router.navigate(`watch/${this.data?.id}/upnext`);
        }

        override _handleUp() {
          this._setState("AddToWatchlistButton");
        }
      },
      class AddToWatchlistButton extends this {
        override _handleEnter() {
          alert("not implemented");
          // Router.navigate(`content/${this.data?.id}`);
        }

        override _getFocused() {
          return this.tag("AddToWatchlistButton");
        }

        override _handleDown() {
          this._setState("UpNextButton");
        }
      },
    ];
  }

  override _init() {
    this._setState("UpNextButton");
  }

  override _onDataProvided() {
    console.log("onDataProvided", this.data);

    const content = this.data;

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

        this.tag("Image").texture = Img(content.images?.asFeed).cover(552, 828);
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
