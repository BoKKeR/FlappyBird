import Phaser from "phaser";
import config from "./config";
import PlayScene from "./scenes/PlayScene";
import { MenuScene } from "./scenes/MenuScene";
import { PreloadScene } from "./scenes/PreloadScene";
const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
};

export type SharedConfigType = {
  width: number;
  height: number;
  startPosition: {
    x: number;
    y: number;
  };
};

const Scenes = [PreloadScene, MenuScene, PlayScene];

const initScenes = () => {
  return Scenes.map((scene) => {
    new scene(SHARED_CONFIG);
  });
};

new Phaser.Game(
  Object.assign(config, {
    scene: [
      new PreloadScene(SHARED_CONFIG),
      new MenuScene(SHARED_CONFIG),
      new PlayScene(SHARED_CONFIG)
    ],
    ...SHARED_CONFIG,
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
        gravity: {
          // y: 200
        }
      }
    }
  })
);
