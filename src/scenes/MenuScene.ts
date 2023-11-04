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
      { scene: "ExitScene", text: "Exit" }
    ];
  }

  preload() {}

  create() {
    super.create();
    this.createMenu(this.menu);
    // this.scene.start("PlayScene");
  }
}
