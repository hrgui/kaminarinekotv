import { Lightning, Launch, PlatformSettings, AppData } from "@lightningjs/sdk";
import { App } from "./App";
import { worker } from "./mocks/browser";

export function getPrecision(width: number) {
  return width / 1920;
}

export default function (
  appSettings: Lightning.Application.Options,
  platformSettings: PlatformSettings,
  appData: AppData
) {
  // worker.start()

  // if (appSettings.stage.w)

  appSettings.stage.precision = getPrecision(window.innerWidth);

  return Launch(App, appSettings, platformSettings, appData);
}
