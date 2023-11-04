import { SharedConfigType } from "..";

export class BaseScene extends Phaser.Scene {
  config: SharedConfigType;
  screenCenter: number[];
  lineHeight: number;
  fontSize: number;
  fontOptions: { fontSize: string; fill: string };

  constructor(key: string, config: SharedConfigType) {
    super(key);
    this.config = config;
    this.lineHeight = 42;
    this.fontSize = 34;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#FFF" };
    this.screenCenter = [config.width / 2, config.height / 2];
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createMenu(menu) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem) => {
      const menuPosition = [...this.screenCenter];
      this.add
        .text(
          this.screenCenter[0],
          this.screenCenter[1] + lastMenuPositionY,
          menuItem.text,
          this.fontOptions
        )
        .setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
    });
  }
}
