import Phaser from "phaser";
import { SharedConfigType } from "..";
import { BaseScene } from "./BaseScene";

export class ScoreScene extends BaseScene {
  menu: { scene: string; text: string }[];
  config: SharedConfigType;

  constructor(config) {
    super("ScoreScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    this.add
      .text(
        this.screenCenter[0],
        this.screenCenter[1],
        "Top score is " + localStorage.getItem("bestScore") || 0 + "!",
        this.fontOptions
      )
      .setOrigin(0.5);
  }
}
