import { Lightning, VideoPlayer, Registry } from "@lightningjs/sdk";
import { dashLoader, dashUnloader } from "../dash/dash";
import Button from "../components/Button";

export default class VideoPlayerPage extends Lightning.Component {
  // _playReadyAction: any;
  // _widevineAction: any;
  _errorTimeout: any;
  // instructions: any;
  _focusedElement: any;

  static override _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        // color: 0xff000000,
        Instructions: {
          rect: true,
          color: 0xff000000,
          mount: 0.5,
          x: (w: any) => w / 2,
          y: (h: any) => h / 2,
          text: {
            text: this.bindProp("instructions"),
            color: 0xffffffff,
            textAlign: "center",
          },
        },
        Options: {
          rect: true,
          color: 0xff000000,
          w: (w: any) => w,
          h: 300,
          y: (h: any) => (2 * h) / 3,
          WidevineOption: {
            x: 750,
            mountX: 0.5,
            type: Button,
            buttonText: "Widevine",
            action: this.bindProp("_widevineAction"),
          },
          PlayReadyOption: {
            x: 1170,
            mountX: 0.5,
            type: Button,
            buttonText: "PlayReady",
            action: this.bindProp("_playReadyAction"),
          },
        },
      },
    };
  }

  get Background() {
    return this.tag("Background");
  }

  get Options() {
    return this.tag("Options");
  }

  override _init() {
    this._setState("MediaOptions");
    // this._playReadyAction = () => this._startPlayReadyMedia();
    // this._widevineAction = () => this._startWidevineMedia();

    VideoPlayer.consumer(this);
    VideoPlayer.loader(dashLoader);
    VideoPlayer.unloader(dashUnloader);
  }

  _startWidevineMedia() {
    console.log("Starting Widevine DRM media");
    this._setState("MediaPlaying");

    const playerOpts = {
      protectionData: {
        "com.widevine.alpha": {
          serverURL: "https://drm-widevine-licensing.axtest.net/AcquireLicense",
          httpRequestHeaders: {
            "X-AxDRM-Message":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA",
          },
        },
      },
    };

    VideoPlayer.open(
      "https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest_1080p.mpd",
      playerOpts
    );
  }

  _startPlayReadyMedia() {
    console.log("Starting PlayReady DRM media");
    this._setState("MediaPlaying");

    const playerOpts = {
      protectionData: {
        "com.microsoft.playready": {
          serverURL:
            "https://test.playready.microsoft.com/service/rightsmanager.asmx?cfg=(persist:false,sl:150)",
        },
      },
      // dash settings:
      streaming: {
        scheduling: {
          scheduleWhilePaused: false, // Stop the player from loading segments while paused
        },
        buffer: {
          fastSwitchEnabled: true, // Enable buffer replacement when switching bitrates for faster switching
        },
        abr: {
          maxBitrate: { audio: -1, video: 2500 }, // reduce bitrate to improve fluidity in this video sample
        },
      },
    };

    VideoPlayer.open(
      "https://profficialsite.origin.mediaservices.windows.net/c51358ea-9a5e-4322-8951-897d640fdfd7/tearsofsteel_4k.ism/manifest(format=mpd-time-csf)",
      playerOpts
    );
  }

  _clearErrorTimeout() {
    this._errorTimeout && Registry.clearTimeout(this._errorTimeout);
  }

  $videoPlayererror() {
    this._clearErrorTimeout();
    this._errorTimeout = Registry.setTimeout(() => {
      this.instructions = "Error encountered.\n\nYour browser might not support this DRM system.";
    }, 5000);
  }

  $videoPlayerError(data: any) {
    console.error("Error playing video", data);
    this.instructions = "Error playing video!";
  }

  $videoPlayerLoadedMetadata() {
    this._clearErrorTimeout();
    this.instructions = "Metadata loaded! If the video doesn't start soon, press enter or play";
  }

  $videoPlayerEvent(event: any, eventData: any) {
    console.log(event, eventData);
  }

  $videoPlayerPlaying() {
    this.Background.visible = false;
  }

  $videoPlayerEnded() {
    this._setState("MediaOptions");
  }

  override _handleEnter() {
    VideoPlayer.playPause();
  }

  _handlePlay() {
    VideoPlayer.play();
  }

  _handlePause() {
    VideoPlayer.pause();
  }

  _handlePlayPause() {
    VideoPlayer.playPause();
  }

  _handleForward() {
    VideoPlayer.skip(10);
  }

  _handleRewind() {
    VideoPlayer.skip(-10);
  }

  override _handleRight() {
    VideoPlayer.skip(10);
  }

  override _handleLeft() {
    VideoPlayer.skip(-10);
  }

  static override _states() {
    return [
      class MediaOptions extends VideoPlayerPage {
        override $enter() {
          this.Options.visible = true;
          this.Background.visible = true;
          this.instructions = "What DRM system would you like to test?";
          this._focusedElement = this.tag("WidevineOption");
        }
        override $exit() {
          this.Options.visible = false;
        }

        override _handleEnter() {
          if (this._focusedElement === this.tag("WidevineOption")) {
            this._startWidevineMedia();
          } else {
            this._startPlayReadyMedia();
          }
        }

        override _handleLeft() {
          this._focusedElement = this.tag("WidevineOption");
        }

        override _handleRight() {
          this._focusedElement = this.tag("PlayReadyOption");
        }

        override _getFocused() {
          return this._focusedElement;
        }
      },
      class MediaPlaying extends VideoPlayerPage {
        override $enter() {
          this.instructions = "Loading video...";
        }
        override $exit() {
          VideoPlayer.clear();
        }
        override _handleBack() {
          this._setState("MediaOptions");
        }
      },
    ];
  }
}
