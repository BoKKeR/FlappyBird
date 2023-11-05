import Phaser from "phaser";
import { SharedConfigType } from "..";
import { BaseScene } from "./BaseScene";

export class PauseScene extends BaseScene {
  menu: { scene: string; text: string }[];
  config: SharedConfigType;

  constructor(config) {
    super("PauseScene", config);
    this.config = config;
    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" }
    ];
  }

  preload() {}

  create() {
    super.create();
    this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
    // this.scene.start("PlayScene");
  }

  setupMenuEvents(menuItem): void {
    const textGO = menuItem.textGO;
    textGO.setInteractive();
    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#fff" });
    });
    textGO.on("pointerup", () => {
      if (menuItem.scene && menuItem.text === "Continue") {
        // shutting down the pause scene and resuiming the play
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        // shutting playscene, pausescene and running menu
        this.scene.stop("PlayScene");
        this.scene.start("MenuScene");
      }
    });
  }
}
