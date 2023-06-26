import { Lightning } from "@lightningjs/sdk";

export default class NotFound extends Lightning.Component {
  static override _template() {
    return {
      w: 1920,
      h: 1080,
      Text: {
        x: 1920 / 2,
        y: 1080 / 2 - 30,
        text: {
          text: "Not Found",
        },
      },
    };
  }
}
