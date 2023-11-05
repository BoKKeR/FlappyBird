export class PreloadScene extends Phaser.Scene {
  constructor(config) {
    super("PreloadScene");
  }

  preload() {
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("sky", "assets/sky.png");
    // this.load.image("bird", "assets/bird.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("back", "assets/back.png");
    this.load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.scene.start("MenuScene");
  }
}
