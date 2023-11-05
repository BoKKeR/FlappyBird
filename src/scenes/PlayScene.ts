import Phaser from "phaser";
import { SharedConfigType } from "..";
import { BaseScene } from "./BaseScene";

export default class Demo extends BaseScene {
  pipesToRender: number;
  currentDifficulty: string;
  initialTime: number;
  bird: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
  config: SharedConfigType;
  pipes: Phaser.Physics.Arcade.Group | null = null;
  flapVelocity: number;
  difficulties: string;
  isPaused: boolean;
  pipeHorizontalDistance: number;
  pipeVerticalDistanceRange: number[];
  pipeHorizontalDistanceRange: number[];
  initialBirdPosition: {
    x: number;
    y: number;
  };
  score: number;
  scoreText: string;

  dificulties: {
    easy: {
      pipeHorizontalDistanceRange: number[];
      pipeVerticalDistanceRange: number[];
    };
    normal: {
      pipeHorizontalDistanceRange: number[];
      pipeVerticalDistanceRange: number[];
    };
    hard: {
      pipeHorizontalDistanceRange: number[];
      pipeVerticalDistanceRange: number[];
    };
  };

  constructor(config) {
    super("PlayScene", config);
    this.pipes = null;
    this.isPaused = false;
    this.config = config;
    this.bird = null;
    this.flapVelocity = 200;
    this.initialBirdPosition = {
      x: 80,
      y: 300
    };

    this.score = 0;
    this.scoreText = "";

    this.pipeHorizontalDistance = 0;

    this.pipesToRender = 4;

    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange: [150, 200]
      },
      normal: {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190]
      },
      hard: {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [120, 1700]
      }
    };
  }

  create() {
    this.currentDifficulty = "hard";
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1
    });

    this.bird.play("fly");
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    this.pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + this.pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalPosition;

    this.pipes.setVelocityX(-200);
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 1) {
      this.currentDifficulty = "normal";
    }
    if (this.score === 3) {
      this.currentDifficulty = "hard";
    }
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false
    });

    this.saveBestScore();
    // this.bird.x = this.config.startPosition.x;
    // this.bird.y = this.config.startPosition.y;
    // this.bird.body.velocity.y = 0;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  update(time: number, delta: number): void {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");

    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#000"
    });
    this.add.text(16, 52, `Best score: ${bestScore || 0}`, {
      fontSize: "18px",
      fill: "#000"
    });
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setScale(3)
      .setFlipX(true)
      .setOrigin(0);

    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 200;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let index = 0; index < this.pipesToRender; index++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-200);
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score.toString());
    }
  }

  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on("pointerdown", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  flap() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  countdown() {
    this.initialTime--;
    this.countDownText.setText("Fly in: " + this.initialTime);

    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          this.screenCenter[0],
          this.screenCenter[1],
          "Fly in: " + this.initialTime,
          this.fontOptions
        )
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countdown,
        loop: true,
        callbackScope: this
      });
    });
  }
}
