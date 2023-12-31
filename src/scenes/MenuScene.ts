import Phaser from "phaser";
import { SharedConfigType } from "..";
import { BaseScene } from "./BaseScene";

export class MenuScene extends BaseScene {
  menu: { scene: string; text: string }[];
  config: SharedConfigType;

  constructor(config) {
    super("MenuScene", config);
    this.config = config;
    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      { scene: null, text: "Exit" }
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
      textGO.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}
