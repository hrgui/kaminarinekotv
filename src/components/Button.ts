import { Lightning } from "@lightningjs/sdk";

export default class Button extends Lightning.Component {
  buttonText?: string;

  static override _template() {
    return {
      color: 0xff1f1f1f,
      texture: Lightning.Tools.getRoundRect(416, 80, 0),
      Label: {
        x: 120,
        y: 45,
        mount: 0.5,
        color: 0xffffffff,
        text: { fontSize: 32, lineHeight: 40 },
      },
    };
  }
  override _init() {
    console.log("Button", this.buttonText);
    this.tag("Label").patch({ text: { text: this.buttonText } });
  }
  override _focus() {
    this.color = 0xffffffff;
    this.tag("Label").color = 0xff1f1f1f;
  }
  override _unfocus() {
    this.color = 0xff1f1f1f;
    this.tag("Label").color = 0xffffffff;
  }
}
