import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";
import routes from "./routes";
import colors from "./colors";

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: {
    Logo: object;
    Mystery: object;
    Text: object;
    Text2: object;
  };
}

export class App extends Router.App {
  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
      w: 1920,
      h: 1080,
      ...super._template(),
    };
  }

  override _setup() {
    Router.startRouter(routes, this);
  }

  static getFonts() {
    return [
      {
        family: "Regular",
        url: Utils.asset("fonts/Lato-Regular.ttf"),
      },
      {
        family: "Semibold",
        url: Utils.asset("fonts/Lato-Semibold.ttf"),
      },
      {
        family: "Bold",
        url: Utils.asset("fonts/Lato-Bold.ttf"),
      },
    ];
  }

  static colors() {
    return colors;
  }
}
